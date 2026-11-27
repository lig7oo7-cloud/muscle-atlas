import {Capacitor} from '@capacitor/core';
import {App} from '@capacitor/app';
import {Filesystem,Directory,Encoding} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';

export const isNative=()=>Capacitor.isNativePlatform();

// 안드로이드 뒤로가기: handler가 true를 돌려주면 처리 완료, false면 앱을 백그라운드로 보냄
export function onBackButton(handler){
  if(!isNative())return ()=>{};
  const listener=App.addListener('backButton',()=>{
    if(!handler())App.minimizeApp();
  });
  return ()=>{listener.then(l=>l.remove())};
}

// 앱에서 백업 파일을 만들고 공유 창(드라이브·카톡·내 파일 등)을 띄움
export async function shareBackupFile(name,text){
  const {uri}=await Filesystem.writeFile({path:name,data:text,directory:Directory.Cache,encoding:Encoding.UTF8});
  await Share.share({title:'근육지도 백업',files:[uri],dialogTitle:'백업 파일 저장할 곳 선택'});
}
