import { v4 as uuidv4 } from "uuid";


  export function setUser(data: { userName: string, socketId: string, isBot: boolean}) {
    try {
      console.log("cccccccccccccccccc",data);
      
      const { userName, socketId, isBot} = data
      return {
        _id: uuidv4(),
        name: data.userName,
        socketId: socketId,
        isBot:isBot, 
      };
  } catch (error) {
    console.log('setUser ERROR', error);
   
  }
}






export const setTable = (userData: any) => {
  console.log('tableFormat userData', userData)
  return {
    _id: uuidv4(),
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
    playerScore:[0,0],
    currentTurn:null,
    currentTurnSI:-1,
    
  };
};
// export { setUser, setTable};

