import {GetServerSideProps} from "next";
import {refreshTokens} from "lib/fetcher";
import {fetcherSSR} from "lib/fetcher-ssr";
import {environment} from "lib/environment";
import {useEffect, useRef, useState} from "react";

export default function Realtime() {
  const [isOpen, setIsOpen] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const ws = useRef<WebSocket>();

  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  console.log(process.env.NEXT_PUBLIC_REALTIME_URL);

  useEffect(() => {
    if (isReconnecting) return;

    if (!ws.current) {
      ws.current = new WebSocket(process.env.NEXT_PUBLIC_REALTIME_URL!);
      ws.current.onopen = () => setIsOpen(true);
      ws.current.onclose = async () => {
        setIsOpen(false);
        setIsReconnecting(true);
        await refreshTokens();
        setIsReconnecting(false);
      };
    }

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = undefined;
      }
    };
  }, [isReconnecting]);

  useEffect(() => {
    if (ws.current) {
      ws.current.onmessage = msg => {
        const parsed = JSON.parse(msg.data);
        setMessages([...messages, parsed]);
      };
    }
  }, [isReconnecting, messages]);

  const send = () => {
    if (ws.current && isOpen) {
      ws.current.send(value);
      setValue("");
    }
  };
  return (
    <main className="flex flex-col items-center mt-4">
      <h1 className="text-xl mb-3 bg-slate-100 px-3 py-1 rounded">
        Websocket Authentication
      </h1>
      <h2
        className={`text-lg mb-3 px-3 py-1 rounded ${
          isOpen ? "text-green-500" : "text-red-500"
        }`}
      >
        {isOpen ? "Connected" : "Disconnected"}
      </h2>

      <input
        className="input w-full max-w-xs input-bordered"
        value={value}
        onChange={event => setValue(event.target.value)}
        onKeyPress={event => event.key === "Enter" && send()}
        placeholder="Send a message"
      ></input>

      <div className="flex flex-col space-y-2 mt-3">
        {messages.map((msg, i) => (
          <div key={i}>{msg.text}</div>
        ))}
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  const {req, res} = context;
  const [error, user] = await fetcherSSR(req, res, `${environment.apiUrl}/me`);
  if (!user) return {redirect: {statusCode: 307, destination: "/"}};
  return {props: {user}};
};
