# WebSockets Auth With Refresh Access Tokens

I did not deploy this example but the end of video in the
`Code History`
section show how to deploy to Kubernetes on google cloud.
Extra files that I did not create buy copied from the repo noted in the
`Code History`
section are stored in the `note_used` directory.

Dev locally by:

- `docker compose up` in the root directory
  - `docker compose restart mongo-express` due to a timing issue
- `yard dev` in the client directory

## Notes

```bash
yarn run ts-node-dev --project api/tsconfig.json -r tsconfig-paths/register api/index.ts
```

```
https://github.com/login/oauth/authorize?client_id=b156b4a3720fb62fca40&redirect_uri=http://localhost:3001/github?scope=user:email
```

## Next JS Client

```bash
yarn create next-app --typescript # project named client
cd client
yarn add -D tailwindcss@latest postcss@latest autoprefixer@latest
npx tailwindcss init -p
yarn add -D daisyui
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
yarn Sadd cookie-parser cors express jsonwebtoken mongodb ts-node uuid axios
yarn add -D @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/node @types/uuid
yarn add -D ts-node-dev tsconfig-paths typescript

git init
touch tsconfig.json .gitignore
mkdir api shared .vscode
touch api/tsconfig.json shared/tsconfig.json .vscode/settings.json

yarn add cookie ws
yarn add -D @types/cookie @types/ws
```

## Code History

The code in this repository is based on the
[Fullstack Authentication with Refresh Access Tokens](https://youtu.be/xMsJPnjiRAc)
video and
[this repo](https://github.com/flolu/auth).
