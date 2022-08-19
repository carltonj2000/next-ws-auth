import Link from "next/link";
import {useRouter} from "next/router";

export function Navigation() {
  const router = useRouter();

  const active = pathname => (router.pathname == pathname ? "active" : "ghost");
  return (
    <div className="navbar bg-gray-100 gap-2 justify-center py-3">
      <Link href="/">
        <a className={`btn btn-${active("/")} text-xl`}>Home</a>
      </Link>
      <Link href="/me">
        <a className={`btn btn-${active("/me")} text-xl`}>CSR</a>
      </Link>
      <Link href="/me-ssr">
        <a className={`btn btn-${active("/me-ssr")} text-xl`}>SSR</a>
      </Link>
      <Link href="/realtime">
        <a className={`btn btn-${active("/realtime")} text-xl`}>Realtime</a>
      </Link>
    </div>
  );
}
