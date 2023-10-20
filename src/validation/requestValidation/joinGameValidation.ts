import mongoose, { Schema, Document } from 'mongoose';
import Joi from 'joi';
import { EVENT_NAME } from '../../constants';
import logger from '../../logger';

interface JoinGameData {
  eventName: string;
  data: {
    userName: string;
  };
}

// Define a Mongoose schema for the document
const joinGameSchema = new Schema({
  eventName: {
    type: String,
    enum: [EVENT_NAME.JOIN_GAME, EVENT_NAME.SIGN_UP],
    required: true
  },
  data: {
    userName: {
      type: String,
      required: true
    }
  }
});

// Define a Mongoose model based on the schema
interface JoinGameDocument extends Document, JoinGameData {}
const JoinGameModel = mongoose.model<JoinGameDocument>('JoinGame', joinGameSchema);

// Validation function
export function joinGameValidation(data: JoinGameData) {
  const joinGameDataSchema = Joi.object({
    eventName: Joi.string().valid(EVENT_NAME.JOIN_GAME, EVENT_NAME.SIGN_UP).required(),
    data: Joi.object({
      userName: Joi.string().required()
    })
  });

  const { error, value } = joinGameDataSchema.validate(data);
  if (error) {
    logger.error(`request validation error in joinGameValidation : ${error}`);
    return null; // Return null or throw an error, depending on your use case
  } else {
    return value;
  }
}

export { JoinGameModel };
