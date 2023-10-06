
import express, { Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import dotenv from 'dotenv';
dotenv.config({path:'./.env'});
import logger from "./logger";
import {connectDB} from "./connections/dbConnection";
import socketConnection from "./connections/socketConnection";
import User from "./model/user";
import Playing from "./model/playing";


const app = express();
const DATABASE_URL = process.env.MONGO_URL
const httpServer = http.createServer(app);
const io: Server = new Server(httpServer, {
  cors:
  { origin: "*" },
  transports: ["polling", "websocket"],
  pingInterval: 2000,
  pingTimeout: 2500,
});
socketConnection(); 





if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }

//database connection
connectDB(DATABASE_URL)



app.use(express.static(path.join(__dirname, "./views")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./views/checker.html"));
});

let port=process.env.PORT;

httpServer.listen(port, () => {
  logger.info(`server is running on port :${port} `)
});

export  {io}

