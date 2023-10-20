import mongoose, { Schema, Document } from 'mongoose';
import { EVENT_NAME } from '../constants';

interface JoinGameDocument extends Document {
  eventName: string;
  data: {
    userName: string;
  };
}

const joinGameSchema = new Schema({
  eventName: {
    type: String,
    required: true,
    enum: [EVENT_NAME.JOIN_GAME, EVENT_NAME.SIGN_UP],
  },
  data: {
    userName: {
      type: String,
      required: true,
    },
  },
});

const JoinGameModel = mongoose.model<JoinGameDocument>('JoinGame', joinGameSchema);

export default JoinGameModel;