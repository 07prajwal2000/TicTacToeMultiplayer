import { Server, matchMaker } from 'colyseus';
import express from 'express';
import { createServer } from 'http';
import HomeController from './apiController/roomsController';
import GameRoom from './roomsController/gameRoom';

const port = parseInt(process.env.PORT || '0') || 3000;

const app = express();

const httpServer = createServer(app);
app.use((req, resp, next) => {
  resp.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  resp.setHeader('Access-Control-Allow-Header', '*');
  resp.setHeader('Access-Control-Allow-Method', '*');
  resp.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(express.json());

const server = new Server({
  server: httpServer
});
matchMaker.controller.exposedMethods = ['reconnect', 'joinById', 'join'];
server.define("defaultGameRoom", GameRoom).setMaxListeners(2);
new HomeController().Initialize(app);

server.listen(port, "0.0.0.0", 0, () => {
  console.log("listening on 0.0.0.0:" + port);
});