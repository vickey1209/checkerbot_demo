"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGameModel = exports.joinGameValidation = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const joi_1 = __importDefault(require("joi"));
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
// Define a Mongoose schema for the document
const joinGameSchema = new mongoose_1.Schema({
    eventName: {
        type: String,
        enum: [constants_1.EVENT_NAME.JOIN_GAME, constants_1.EVENT_NAME.SIGN_UP],
        required: true
    },
    data: {
        userName: {
            type: String,
            required: true
        }
    }
});
const JoinGameModel = mongoose_1.default.model('JoinGame', joinGameSchema);
exports.JoinGameModel = JoinGameModel;
// Validation function
function joinGameValidation(data) {
    const joinGameDataSchema = joi_1.default.object({
        eventName: joi_1.default.string().valid(constants_1.EVENT_NAME.JOIN_GAME, constants_1.EVENT_NAME.SIGN_UP).required(),
        data: joi_1.default.object({
            userName: joi_1.default.string().required()
        })
    });
    const { error, value } = joinGameDataSchema.validate(data);
    if (error) {
        logger_1.default.error(`request validation error in joinGameValidation : ${error}`);
        return null; // Return null or throw an error, depending on your use case
    }
    else {
        return value;
    }
}
exports.joinGameValidation = joinGameValidation;
