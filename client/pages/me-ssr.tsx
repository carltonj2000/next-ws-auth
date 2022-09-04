import {FC} from "react";
import {GetServerSideProps} from "next";
import {fetcherSSR} from "lib/fetcher-ssr";
import {environment} from "lib/environment";
import {useUser} from "contexts/user-context";
import Logout from "components/logout";

const MeSSR: FC = () => {
  const {user} = useUser();
  return (
    <main className="flex flex-col items-center mt-4">
      <h1 className="text-xl mb-3 bg-slate-100 px-3 py-1 rounded">
        Server Side Authentication
      </h1>
      {user ? <p>Hi, {user.name}</p> : <p>Failed SSR user auth</p>}
      <Logout />
    </main>
  );
};

export default MeSSR;

export const getServerSideProps: GetServerSideProps = async context => {
  const {req, res} = context;
  const [error, user] = await fetcherSSR(req, res, `${environment.apiUrl}/me`);
  if (!user) return {redirect: {statusCode: 307, destination: "/"}};
  return {props: {user}};
};
