import { setTable, setUser } from "../defaultFormat";
import { Get, Set } from "../redisOperation";
import { EVENT_NAME, REDIS_KEY } from "../constants";
import Event from '../eventEmitter/index';
import { botSignUp } from "../bot/botSignUp";
import bull from "../bull";

const signUp = async (signupData:any, socket:any) => {
    try {
        console.log('signUpGame data ::---------- >>', signupData);
        signupData.socketId = socket.id;
        let userDefault: any = setUser(signupData);
        await Set(`${REDIS_KEY.USER}:${userDefault._id}`, userDefault);
        let getUser = await Get(`${REDIS_KEY.USER}:${userDefault._id}`);
        console.log("getuser=========>>>>", getUser);
        
        if (getUser) {
            socket.userId = getUser._id;
            let userData = {
                eventName: EVENT_NAME.SIGN_UP,
                data: {
                    userId: getUser._id
                }
            };
            Event.sendToSocket(socket.id, userData);
        }

        let gettableQueue = await Get(REDIS_KEY.REDIS_QUEUE);
        console.log('gettableQueue ', gettableQueue);
        if (gettableQueue && gettableQueue.tableIds && gettableQueue.tableIds.length > 0) {
            console.log('gettableQueue :: >>', gettableQueue.tableIds);
            let table = await Get(`${REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`);
            table.playerInfo.push(getUser);
            table.activePlayer += 1;
            socket.tableId = table._id;
            await Set(`${REDIS_KEY.REDIS_TABLE}:${gettableQueue.tableIds[0]}`, table);

            if (table.activePlayer == table.maxPlayer) {
                console.log('table.activePlayer :: ', table.activePlayer);

                let firstPlayer = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
                bull.addJob.turnDelay({
                    delayTime: 5000,
                    attempts: table._id,
                    userId: table._id,
                    jobId: table._id
                });

                gettableQueue.tableIds.shift();
                await Set(REDIS_KEY.REDIS_QUEUE, gettableQueue);

                let roomData = {
                    eventName: EVENT_NAME.JOIN_GAME,
                    data: {
                        playerInfo: table.playerInfo,
                        userId: getUser._id,
                        board: table.board,
                        tableId: table._id
                    }
                };
                Event.sendToRoom(table._id, roomData);

                let roomValidateData = {
                    eventName: EVENT_NAME.START_GAME,
                    data: {
                        currentturn: firstPlayer,
                        tableId: table._id,
                        roundTimer: 5
                    },
                };
                Event.sendToRoom(table._id, roomValidateData);
            } else {
                await botSignUp();
            }
        } else {
            let gameTableDefaultFormat = await setTable(getUser) 
            console.log('gameTableDefaultFormat :: >>', gameTableDefaultFormat);
            gameTableDefaultFormat.activePlayer += 1;
            socket.tableId = gameTableDefaultFormat._id;
            await Set(`${REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat?._id}`, gameTableDefaultFormat);
            let board = await Get(`${REDIS_KEY.REDIS_TABLE}:${gameTableDefaultFormat._id}`);
            socket.join(board._id);

            let roomData: any = {
                eventName: EVENT_NAME.JOIN_GAME,
                data: {
                    playerInfo: board.playerInfo,
                    userId: getUser._id,
                    board: board.board,
                    tableId: board._id
                }
            };
            Event.sendToRoom(board._id, roomData);

            let addTableQueue = await Get(REDIS_KEY.REDIS_QUEUE);
            if (!addTableQueue) {
                await Set(REDIS_KEY.REDIS_QUEUE, { tableIds: [board._id] });
            } else {
                addTableQueue.tableIds.push(board._id);
                await Set(REDIS_KEY.REDIS_QUEUE, addTableQueue);
            }
            Event.sendToRoom(board._id, roomData);
            if (board.activePlayer != board.maxPlayer) {
                await botSignUp();
            }
        }
    } catch (error) {
        console.log('signUpGame ERROR', error);
    }
}

export { signUp }

























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
