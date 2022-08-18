import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

import {databaseClient} from "./database";
import {getGitHubUser} from "./github-adapter";
import {
  getUserByGitHubId,
  createUser,
  getUserById,
  increaseTokenVersion,
} from "./user-service";
import {
  buildTokens,
  clearTokens,
  refreshTokens,
  setTokens,
  verifyRefreshToken,
} from "./token-utils";
import {Cookies} from "@shared";
import {authMiddleware} from "./auth-middleware";

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

app.get("/refresh", async (req, res) => {
  try {
    const current = verifyRefreshToken(req.cookies[Cookies.RefreshToken]);
    const user = await getUserById(current.userId);
    if (!user) throw "User not found";

    const {accessToken, refreshToken} = refreshTokens(
      current,
      user.tokenVersion
    );
    setTokens(res, accessToken, refreshToken);
  } catch (error) {
    clearTokens(res);
  }
  res.end();
});

app.get("/logout", authMiddleware, async (req, res) => {
  clearTokens(res);
  res.end();
});

app.get("/logout-all", authMiddleware, async (req, res) => {
  await increaseTokenVersion(res.locals.token.userId);
  clearTokens(res);
  res.end();
});

app.get("/me", authMiddleware, async (req, res) => {
  const user = await getUserById(res.locals.token.useId);
  res.json(user);
});

async function main() {
  await databaseClient.connect();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log("server listening on port ", PORT));
}

main();
