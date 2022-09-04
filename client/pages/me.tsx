import {useEffect} from "react";
import Router from "next/router";

import {UserDocument} from "@shared";
import {useUser} from "contexts/user-context";
import {environment} from "lib/environment";
import {fetcher} from "lib/fetcher";
import Logout from "components/logout";

export default function Me() {
  const {user, setUser} = useUser();

  const getMe = async () => {
    const [error, user] = await fetcher<UserDocument>(
      `${environment.apiUrl}/me`
    );
    if (!error && user) setUser(user);
    else Router.push("/");
  };

  useEffect(() => {
    if (!user) getMe();
  }, []);

  return (
    <main className="flex flex-col items-center mt-4">
      <h1 className="text-xl mb-3 bg-slate-100 px-3 py-1 rounded">
        Client Side Authentication
      </h1>
      {user ? <p>Hi, {user.name}</p> : <p>Loading ...</p>}
      <Logout />
    </main>
  );
}
