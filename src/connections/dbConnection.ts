import mongoose from "mongoose";
import logger from "../logger";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async(MONGO_URL: string) => {
    try{
        const DB_OPTIONS = {
      
            dbName:"checker"
        }
        await mongoose.connect(MONGO_URL , DB_OPTIONS)
    logger.info("DB connected successfully")
  
    }catch(error)
    {
       logger.error(error);
    }

}
export { connectDB };