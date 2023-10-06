
import mongoose, { Schema, Document } from 'mongoose';
import logger from "../logger";

export interface UserInterface extends Document {
    username: string;
    email: string;
    password: string;
}

const userSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model<UserInterface>('User', userSchema);
logger.info(`server is running on poCDVSDVrt `)

export default User;
