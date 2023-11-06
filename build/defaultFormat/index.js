"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setTable = exports.setUser = void 0;
const uuid_1 = require("uuid");
function setUser(data) {
    try {
        console.log("cccccccccccccccccc", data);
        const { userName, socketId, isBot } = data;
        return {
            _id: (0, uuid_1.v4)(),
            name: data.userName,
            socketId: socketId,
            isBot: isBot,
        };
    }
    catch (error) {
        console.log('setUser ERROR', error);
    }
}
exports.setUser = setUser;
const setTable = (userData) => {
    console.log('tableFormat userData', userData);
    return {
        _id: (0, uuid_1.v4)(),
        activePlayer: 0,
        maxPlayer: 2,
        board: [
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 1],
            [1, 0, 1, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
            [2, 0, 2, 0, 2, 0, 2, 0],
            [0, 2, 0, 2, 0, 2, 0, 2],
        ],
        playerInfo: [userData],
        status: "waiting",
        playerScore: [0, 0],
        currentTurn: null,
        currentTurnSI: -1,
    };
};
exports.setTable = setTable;
// export { setUser, setTable};
