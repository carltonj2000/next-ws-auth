# Websockets Auth With Refresh Access Tokens

```bash
yarn run ts-node-dev --project api/tsconfig.json -r tsconfig-paths/register api/index.ts
```

```
https://github.com/login/oauth/authorize?client_id=b156b4a3720fb62fca40&redirect_uri=http://localhost:3001/github?scope=user:email
```

## Mongo

```bash
docker compose up/down
docker compose restart mongo-express
```

## Creation History

```bash
mkdir next-ws-auth
cd next-ws-auth/
yarn init -y
yarn add cookie-parser cors express jsonwebtoken mongodb ts-node uuid axios
yarn add -D @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/node @types/uuid
yarn add -D ts-node-dev tsconfig-paths typescript

git init
touch tsconfig.json .gitignore
mkdir api shared .vscode
touch api/tsconfig.json shared/tsconfig.json .vscode/settings.json
```

## Code History

The code in this repository is based on the
[Fullstack Authentication with Refresh Access Tokens](https://youtu.be/xMsJPnjiRAc)
video.
