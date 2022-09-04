import {FC} from "react";
import {useUser} from "contexts/user-context";
import {isPostfixUnaryExpression} from "typescript";
import Router from "next/router";
import {poster} from "lib/fetcher";

const Logout: FC = () => {
  const {user} = useUser();

  const onLogout = async () => {
    await poster(`${process.env.NEXT_PUBLIC_API_URL}/logout`);
    Router.replace("/");
  };
  const onLogoutAll = async () => {
    await poster(`${process.env.NEXT_PUBLIC_API_URL}/logout-all`);
    Router.replace("/");
  };
  if (user)
    return (
      <main className="flex flex-col items-center mt-4">
        <button className="btn btn-primary" onClick={onLogout}>
          Logout
        </button>
        <button className="btn btn-secondary mt-4" onClick={onLogoutAll}>
          Logout All
        </button>
      </main>
    );
  else return <div>No one logged in.</div>;
};

export default Logout;
