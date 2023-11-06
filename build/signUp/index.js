"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUp = void 0;
const defaultFormat_1 = require("../defaultFormat");
const redisOperation_1 = require("../redisOperation");
const constants_1 = require("../constants");
const index_1 = __importDefault(require("../eventEmitter/index"));
const botSignUp_1 = require("../bot/botSignUp");
const bull_1 = __importDefault(require("../bull"));
const signUp = (signupData, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('signUpGame data ::---------- >>', signupData);
        signupData.socketId = socket.id;
        let userDefault = (0, defaultFormat_1.setUser)(signupData);
        yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.USER}:${userDefault._id}`, userDefault);
        let getUser = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.USER}:${userDefault._id}`);
        console.log("getuser=========>>>>", getUser);
        if (getUser) {
            socket.userId = getUser._id;
            let userData = {
                eventName: constants_1.EVENT_NAME.SIGN_UP,
                data: {
                    userId: getUser._id
                }
            };
            index_1.default.sendToSocket(socket.id, userData);
        }
        let gettableQueue = yield (0, redisOperation_1.Get)(constants_1.REDIS_KEY.REDIS_QUEUE);
        console.log('gettableQueue ', gettableQueue);
        if (gettableQueue && gettableQueue.tableIds && gettableQueue.tableIds.length > 0) {
            console.log('gettableQueue :: >>', gettableQueue.tableIds);
            let table = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`);
            table.playerInfo.push(getUser);
            table.activePlayer += 1;
            socket.tableId = table._id;
            yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`, table);
            if (table.activePlayer == table.maxPlayer) {
                console.log('table.activePlayer :: ', table.activePlayer);
                let firstPlayer = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
                bull_1.default.addJob.turnDelay({
                    delayTime: 5000,
                    attempts: table._id,
                    userId: table._id,
                    jobId: table._id
                });
                gettableQueue.tableIds.shift();
                yield (0, redisOperation_1.Set)(constants_1.REDIS_KEY.REDIS_QUEUE, gettableQueue);
                let roomData = {
                    eventName: constants_1.EVENT_NAME.JOIN_GAME,
                    data: {
                        playerInfo: table.playerInfo,
                        userId: getUser._id,
                        board: table.board,
                        tableId: table._id
                    }
                };
                index_1.default.sendToRoom(table._id, roomData);
                let roomValidateData = {
                    eventName: constants_1.EVENT_NAME.START_GAME,
                    data: {
                        currentturn: firstPlayer,
                        tableId: table._id,
                        roundTimer: 5
                    },
                };
                index_1.default.sendToRoom(table._id, roomValidateData);
            }
            else {
                yield (0, botSignUp_1.botSignUp)();
            }
        }
        else {
            let gameTableDefaultFormat = yield (0, defaultFormat_1.setTable)(getUser);
            console.log('gameTableDefaultFormat :: >>', gameTableDefaultFormat);
            gameTableDefaultFormat.activePlayer += 1;
            socket.tableId = gameTableDefaultFormat._id;
            yield (0, redisOperation_1.Set)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat === null || gameTableDefaultFormat === void 0 ? void 0 : gameTableDefaultFormat._id}`, gameTableDefaultFormat);
            let board = yield (0, redisOperation_1.Get)(`${constants_1.REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat._id}`);
            socket.join(board._id);
            let roomData = {
                eventName: constants_1.EVENT_NAME.JOIN_GAME,
                data: {
                    playerInfo: board.playerInfo,
                    userId: getUser._id,
                    board: board.board,
                    tableId: board._id
                }
            };
            index_1.default.sendToRoom(board._id, roomData);
            let addTableQueue = yield (0, redisOperation_1.Get)(constants_1.REDIS_KEY.REDIS_QUEUE);
            if (!addTableQueue) {
                yield (0, redisOperation_1.Set)(constants_1.REDIS_KEY.REDIS_QUEUE, { tableIds: [board._id] });
            }
            else {
                addTableQueue.tableIds.push(board._id);
                yield (0, redisOperation_1.Set)(constants_1.REDIS_KEY.REDIS_QUEUE, addTableQueue);
            }
            index_1.default.sendToRoom(board._id, roomData);
            if (board.activePlayer != board.maxPlayer) {
                yield (0, botSignUp_1.botSignUp)();
            }
        }
    }
    catch (error) {
        console.log('signUpGame ERROR', error);
    }
});
exports.signUp = signUp;
// import { setTable ,setUser} from "../defaultFormat";
// import {Get , Set} from "../redisOperation";
// import {EVENT_NAME,REDIS_KEY} from "../constants";
// import Event from '../eventEmitter/index';
// import { botSignUp } from "../bot/botSignUp";
// import bull from "../bull";
// const signUp = async (signupData: any, socket: any) => {
//     try {
//         console.log('signUpGame data ::---------- >>', signupData)
//         signupData.socketId = socket.id
//         let userDefault: any = setUser(signupData,socket,true)
//         await Set(`${REDIS_KEY.USER}:${userDefault._id}`, userDefault)
//         let getUser = await Get(`${REDIS_KEY.USER}:${userDefault._id}`)
//         let tableData :Table=await Get(`${REDIS_KEY.REDIS_TABLE}:${data.data.tableId}`);
//         if (getUser) {
//             socket.userId = getUser._id;
//             let userData: any = {
//                 eventName: EVENT_NAME.SIGN_UP,
//                 data: {
//                     userId: getUser._id
//                 }
//             }
//             Event.sendToSocket(socket.id, userData)
//         }
//         let gettableQueue: any = await Get(REDIS_KEY.REDIS_QUEUE)
//         console.log('gettableQueue ', gettableQueue)
//         if (gettableQueue && gettableQueue.tableIds && gettableQueue.tableIds.length > 0) {
//             console.log('gettableQueue :: >>', gettableQueue.tableIds)
//             let table = await Get(`${REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`)
//             table.playerInfo.push(getUser)
//             table.activePlayer += 1;
//             socket.tableId = table._id;
//             await Set(`${REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`, table)
//             if (table.activePlayer == table.maxPlayer) {
//                 console.log('table.activePlayer :: ', table.activePlayer)
//                 let firstPlayer = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
//                 bull.addJob.turnDelay({
//                     delayTime: 5000,
//                     attempts: table._id,
//                     userId: table._id,
//                     jobId:table._id
//                 })
//                 gettableQueue.tableIds.shift();
//                 await Set(REDIS_KEY.REDIS_QUEUE, gettableQueue)
//                 let roomData: any = {
//                     eventName: EVENT_NAME.JOIN_GAME,
//                     data: {
//                         playerInfo: table.playerInfo,
//                         userId: getUser._id,
//                         board: table.board,
//                         tableId: table._id
//                     }
//                 }
//                 Event.sendToRoom(table._id, roomData)
//                 let roomValidateData = {
//                     eventName: EVENT_NAME.START_GAME,
//                     data: {
//                         currentturn: firstPlayer,
//                         tableId: table._id,
//                         roundTimer: 5
//                     },
//                 };
//                 Event.sendToRoom(table._id, roomValidateData)
//             } else {
//                 await botSignUp()
//             }
//         } else {
//             let gameTableDefaultFormat: any = await setTable(getUser, socket.turnId)
//             console.log('gameTableDefaultFormat :: >>', gameTableDefaultFormat)
//             gameTableDefaultFormat.activePlayer += 1;
//             socket.tableId = gameTableDefaultFormat._id;
//             await Set(`${REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat?._id}`, gameTableDefaultFormat)
//             let board = await Get(`${REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat._id}`)
//             socket.join(board._id)
//             let roomData: any = {
//                 eventName: EVENT_NAME.JOIN_GAME,
//                 data: {
//                     playerInfo: board.playerInfo,
//                     userId: getUser._id,
//                     board: board.board,
//                     tableId: board._id
//                 }
//             }
//             Event.sendToRoom(board._id, roomData)
//             let addTableQueue = await Get(REDIS_KEY.REDIS_QUEUE)
//             if (!addTableQueue) {
//                 await Set(REDIS_KEY.REDIS_QUEUE, { tableIds: [board._id] })
//             } else {
//                 addTableQueue.tableIds.push(board._id)
//                 await Set(REDIS_KEY.REDIS_QUEUE, addTableQueue)
//             }
//             Event.sendToRoom(board._id, roomData)
//             if (board.activePlayer != board.maxPlayer) {
//                 await botSignUp()
//             }
//         }
//     }
//     catch (error) {
//         console.log('joinGame ERROR', error)
//     }
//     Event.sendToRoom(tableData._id,sendUserData);
//         let userTurnStartData={
//             eventName:EVENT_NAME.USER_TURN_START,
//             data:{
//                 userId:tableData.turnId,
//             }
//         }
//         Event.sendToRoom(tableData._id,userTurnStartData)
//     }else {
//         joinGame(data,socket);
//     }
// }
// export { signUp }   
