import express, { Request, Response } from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import dotenv from 'dotenv';
// import JoinGameModel from "../src/validation/requestValidation/joinGameValidation"
import connectDB from "./connection/mongoConnection"
import logger from "./logger";
import socketConnection from "./connection/socketConnection";
dotenv.config({path:'./.env'});
const DATABASE_URL = process.env.DATABASE_URL


//databse connection
connectDB(DATABASE_URL)


const app = express();
const httpServer = http.createServer(app);
const io: Server = new Server(httpServer, {
  cors:
  { origin: "*" },
  transports: ["polling", "websocket"],
  pingInterval: 2000,
  pingTimeout: 2500,
});
socketConnection(); 

app.use(express.static(path.join(__dirname, "./view")));

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./view/game.html"));
});

const port = process.env.SERVER_PORT;
httpServer.listen(port,()=>{
   logger.info(`server is running on port : ${port}`)
})


export  {io}
