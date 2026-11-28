FROM node:22-alpine
WORKDIR /app
COPY server.js .
ENV DATA_DIR=/data PORT=8790
USER node
CMD ["node", "server.js"]
