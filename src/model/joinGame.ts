// import joinGameValidationSchema from '../validation/requestValidation';

// import mongoose, { Schema, Document } from 'mongoose';
// import { EVENT_NAME } from '../constants';
// import logger from '../logger';


// const joinGameSchema = new Schema({
//     eventName: {
//         type: String,
//         enum: [EVENT_NAME.JOIN_GAME, EVENT_NAME.SIGN_UP],
//         required: true
//     },
//     data: {
//         userName: {
//             type: String,
//             required: true
//         }
//     }
// });

// const JoinGameModel = mongoose.model<JoinGameDocument>('JoinGame', joinGameSchema);

// export function joinGameValidation(data: JoinGameInterface) {
//     const { error, value } = joinGameValidationSchema.validate(data);
//     if (error) {
//         logger.error(`request validation error in joinGameValidation : ${error}`);
//     } else {
//         return value;
//     }
// }

// export default JoinGameModel;