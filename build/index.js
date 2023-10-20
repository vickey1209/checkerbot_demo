"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
// import JoinGameModel from "../src/validation/requestValidation/joinGameValidation"
const mongoConnection_1 = __importDefault(require("./connection/mongoConnection"));
const logger_1 = __importDefault(require("./logger"));
const socketConnection_1 = __importDefault(require("./connection/socketConnection"));
dotenv_1.default.config({ path: './.env' });
const DATABASE_URL = process.env.DATABASE_URL;
//databse connection
(0, mongoConnection_1.default)(DATABASE_URL);
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: "*" },
    transports: ["polling", "websocket"],
    pingInterval: 2000,
    pingTimeout: 2500,
});
exports.io = io;
(0, socketConnection_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "./view")));
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "./view/game.html"));
});
const port = process.env.SERVER_PORT;
httpServer.listen(port, () => {
    logger_1.default.info(`server is running on port : ${port}`);
});
