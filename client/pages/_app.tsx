import type {AppProps} from "next/app";
import "tailwindcss/tailwind.css";
import {Navigation} from "components/navigation";
import {UserProvider} from "contexts/user-context";

function MyApp({Component, pageProps}: AppProps) {
  return (
    <UserProvider initialUser={pageProps?.user}>
      <div className="flex flex-col max-w-xl mx-auto">
        <Navigation />
        <Component {...pageProps} />
      </div>
    </UserProvider>
  );
}

export default MyApp;
