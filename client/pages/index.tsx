import type {NextPage} from "next";
import {environment} from "lib/environment";
import Link from "next/link";

const gitHubUrl = `https://github.com/login/oauth/authorize?client_id=${environment.gitHubClientId}&redirect_uri=${environment.gitHubRedirectUri}?scope=user:email`;

const Home: NextPage = () => {
  return (
    <main className="flex mt-4 justify-center">
      <Link href={gitHubUrl}>
        <a className="btn btn-primary">Sign in with GitHub</a>
      </Link>
    </main>
  );
};

export default Home;
