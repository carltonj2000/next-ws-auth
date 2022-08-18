import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import {databaseClient} from "./database";
import {getGitHubUser} from "./github-adapter";
import {getUserByGitHubId, createUser} from "./user-service";
import {buildTokens, setTokens} from "./token-utils";

const app = express();

app.use(cors({credentials: true, origin: process.env.CLIENT_URL}));
app.use(cookieParser());

app.get("/", (req, res) => res.send("api is healthy"));

app.get("/github", async (req, res) => {
  const {code} = req.query;
  const gitHubUser = await getGitHubUser(code as string);
  let user = await getUserByGitHubId(gitHubUser.id);
  if (user === null) {
    user = await createUser(gitHubUser.name, gitHubUser.id);
  }

  const {accessToken, refreshToken} = buildTokens(user);
  setTokens(res, accessToken, refreshToken);
  res.redirect(`${process.env.CLIENT_URL}/me`);
});

app.get("/refresh", async (req, res) => {});
app.get("/logout", async (req, res) => {});
app.get("/logout-all", async (req, res) => {});
app.get("/me", async (req, res) => {
  res.send("moi");
});

async function main() {
  await databaseClient.connect();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("server listening on port ", PORT));
}

main();
