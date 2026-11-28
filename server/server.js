// 근육지도 기록 동기화 서버: 앱 기록 전체를 저장하고, 저장할 때마다 이전 상태를 남겨 되돌릴 수 있게 한다.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const KEY = process.env.SYNC_KEY || '';
const DIR = process.env.DATA_DIR || '/data';
const PORT = Number(process.env.PORT || 8790);
const KEEP = Number(process.env.KEEP_HISTORY || 300);
const MAX_BODY = 30 * 1024 * 1024;
if (KEY.length < 16) { console.error('SYNC_KEY 환경변수가 필요합니다'); process.exit(1); }

const currentFile = path.join(DIR, 'current.json');
const historyDir = path.join(DIR, 'history');
const indexFile = path.join(historyDir, 'index.json');
await fs.mkdir(historyDir, { recursive: true });

const readJson = async (file, fallback) => { try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return fallback; } };
async function writeJson(file, value) {
  const tmp = file + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(value));
  await fs.rename(tmp, file);
}
let state = await readJson(currentFile, null);
let index = await readJson(indexFile, []);

const keyHash = crypto.createHash('sha256').update(KEY).digest();
const authorized = req => {
  const given = crypto.createHash('sha256').update(String(req.headers['x-sync-key'] || '')).digest();
  return crypto.timingSafeEqual(given, keyHash);
};
const isObject = v => v !== null && typeof v === 'object' && !Array.isArray(v);
const validData = d => isObject(d) && d.format === 'muscle-atlas-records' && d.version === 1 && isObject(d.workouts) && isObject(d.mobility);
const counts = d => ({
  logs: Array.isArray(d?.workouts?.logs) ? d.workouts.logs.length : 0,
  custom: Array.isArray(d?.workouts?.custom) ? d.workouts.custom.length : 0,
  mobility: Object.values(d?.mobility || {}).flat().length,
});
const summary = s => s ? { rev: s.rev, savedAt: s.savedAt, counts: s.counts, reason: s.reason } : { rev: 0 };

function send(res, code, body) {
  res.writeHead(code, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, X-Sync-Key',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Cache-Control': 'no-store',
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', c => { size += c.length; if (size > MAX_BODY) { reject(Object.assign(new Error('too large'), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { reject(Object.assign(new Error('bad json'), { code: 400 })); } });
    req.on('error', reject);
  });
}

let queue = Promise.resolve();
const serial = job => (queue = queue.then(job, job));

async function save(data, reason) {
  const rev = (state?.rev || 0) + 1;
  const next = { rev, savedAt: new Date().toISOString(), reason: String(reason || 'sync').slice(0, 40), counts: counts(data), data };
  await writeJson(path.join(historyDir, rev + '.json'), next);
  await writeJson(currentFile, next);
  state = next;
  index = [summary(next), ...index].slice(0, KEEP + 50);
  const keep = new Set(index.slice(0, KEEP).map(i => i.rev));
  for (const old of index.slice(KEEP)) await fs.rm(path.join(historyDir, old.rev + '.json'), { force: true });
  index = index.filter(i => keep.has(i.rev));
  await writeJson(indexFile, index);
  return next;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (req.method === 'OPTIONS') return send(res, 204);
    if (url.pathname === '/api/health') return send(res, 200, { ok: true });
    if (!url.pathname.startsWith('/api/')) return send(res, 404, { error: 'not found' });
    if (!authorized(req)) return send(res, 401, { error: '인증키가 맞지 않아요' });

    if (url.pathname === '/api/records' && req.method === 'GET')
      return send(res, 200, state ? { ...summary(state), data: state.data } : { rev: 0, data: null });

    if (url.pathname === '/api/records' && req.method === 'PUT') {
      const body = await readBody(req);
      if (!validData(body.data)) return send(res, 400, { error: '근육지도 기록 형식이 아니에요' });
      return await serial(async () => {
        const current = state?.rev || 0;
        if (Number(body.baseRev) !== current) return send(res, 409, { ...summary(state), data: state?.data ?? null });
        const saved = await save(body.data, body.reason);
        return send(res, 200, summary(saved));
      });
    }

    if (url.pathname === '/api/history' && req.method === 'GET') return send(res, 200, { current: state?.rev || 0, items: index });

    const m = url.pathname.match(/^\/api\/history\/(\d+)$/);
    if (m) {
      const rev = Number(m[1]);
      if (!index.some(i => i.rev === rev)) return send(res, 404, { error: '없는 저장 기록이에요' });
      if (req.method === 'GET') return send(res, 200, await readJson(path.join(historyDir, rev + '.json'), null));
      if (req.method === 'DELETE') {
        if (rev === state?.rev) return send(res, 400, { error: '현재 기록은 지울 수 없어요' });
        return await serial(async () => {
          await fs.rm(path.join(historyDir, rev + '.json'), { force: true });
          index = index.filter(i => i.rev !== rev);
          await writeJson(indexFile, index);
          return send(res, 200, { deleted: rev });
        });
      }
    }
    return send(res, 404, { error: 'not found' });
  } catch (e) {
    send(res, e.code === 413 ? 413 : e.code === 400 ? 400 : 500, { error: e.code === 413 ? '기록이 너무 커요' : e.code === 400 ? '요청 형식 오류' : '서버 오류' });
    if (!e.code) console.error(e);
  }
});
server.listen(PORT, () => console.log('muscle-sync listening on', PORT));
