import { Server, matchMaker } from 'colyseus';
import express from 'express';
import { createServer } from 'http';
import HomeController from './apiController/roomsController';
import GameRoom from './roomsController/gameRoom';
import { config } from 'dotenv';

const port = parseInt(process.env.PORT || '0') || 3000;

const app = express();
config();
const httpServer = createServer(app);
app.use(express.json());
app.use((_, resp, next) => {
  resp.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_DOMAINS);
  resp.setHeader('Access-Control-Allow-Headers', '*');
  resp.setHeader('Access-Control-Allow-Methods', '*');
  resp.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

const server = new Server({
  server: httpServer
});
matchMaker.controller.exposedMethods = ['reconnect', 'joinById', 'join'];
server.define("defaultGameRoom", GameRoom).setMaxListeners(2);
new HomeController().Initialize(app);

server.listen(port, "0.0.0.0", 0, () => {
  console.log("listening on 0.0.0.0:" + port);
});