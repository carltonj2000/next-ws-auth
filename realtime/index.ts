import {Socket} from "net";
import {createServer, IncomingMessage} from "http";
import * as WebSocket from "ws";
import * as cookie from "cookie";
import * as jwt from "jsonwebtoken";
import {AccessToken, Cookies} from "@shared";

const server = createServer((req, res) => res.end());
const wss = new WebSocket.Server({noServer: true});

interface AuthenticatedSocket extends WebSocket {
  accessToken: AccessToken;
}

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;

server.on(
  "upgrade",
  (request: IncomingMessage, socket: Socket, head: Buffer) => {
    try {
      const cookies = cookie.parse(request.headers.cookie as string);
      const accessToken = jwt.verify(
        cookies[Cookies.AccessToken],
        accessTokenSecret
      ) as AccessToken;
      wss.handleUpgrade(request, socket, head, ws => {
        (ws as AuthenticatedSocket).accessToken = accessToken;
        wss.emit("connection", ws);
      });
    } catch (error) {
      socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
      socket.destroy();
    }
  }
);

wss.on("connection", (socket: AuthenticatedSocket) => {
  socket.on("message", (message: Buffer) => {
    const msg = {text: message.toString(), userId: socket.accessToken.userId};
    broadcast(msg);
  });
});

function broadcast(msg: any) {
  (wss.clients as Set<AuthenticatedSocket>).forEach(client => {
    validateExpiration(client);
    client.send(JSON.stringify(msg));
  });
}

function validateExpiration(socket: AuthenticatedSocket) {
  if (new Date().getTime() / 1000 > socket.accessToken.exp) {
    socket.close();
  }
}

server.listen(3000);
