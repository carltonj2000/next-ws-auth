import {v4 as uuidv4} from "uuid";
import {UserDocument} from "@shared";
import {databaseClient} from "./database";

function collection() {
  return databaseClient
    .db(process.env.MONGO_DB)
    .collection<UserDocument>("users");
}

export async function createUser(name: string, gitHubUserId: number) {
  const user: UserDocument = {
    id: uuidv4(),
    name,
    tokenVersion: 0,
    gitHubUserId: gitHubUserId.toString(),
  };
  const coll = await collection();
  const result = await coll.insertOne(user);
  if (result.acknowledged) return user;

  throw new Error();
}

export async function getUserById(id: string) {
  const coll = await collection();
  return coll.findOne({id});
}

export async function getUserByGitHubId(gitHubUserId: number) {
  const coll = await collection();
  const result = await coll.findOne({gitHubUserId: gitHubUserId.toString()});
  const res2 = result as UserDocument;
  return res2;
}

export async function increaseTokenVersion(userId: string) {
  const coll = await collection();
  const result = await coll.findOneAndUpdate(
    {id: userId},
    {$inc: {tokenVersion: 1}}
  );
  if (result.ok) return result.value;
  throw new Error();
}
