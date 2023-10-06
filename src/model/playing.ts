

import mongoose, { Schema, Document } from 'mongoose';

export interface PlayingInterface extends Document {
    player1: string;
    player2: string;
    board: string[]; // This could be an array representing the game board
    winner: string | null;
}

const playingSchema: Schema = new Schema({
    player1: { type: String, required: true },
    player2: { type: String, required: true },
    board: [{ type: String }], // Modify this based on your game logic
    winner: { type: String, default: null }
});

const Playing = mongoose.model<PlayingInterface>('Playing', playingSchema);

export default Playing;
