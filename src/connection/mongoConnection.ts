import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
import logger from '../logger';



const connectDB = async(DATABASE_URL:any) => {
    try{
        const DB_OPTIONS: mongoose.ConnectOptions = {
            dbName: ""
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
    logger.info("mongoDB connected successfully")
  
    }catch(error)
    {
       logger.error('mongodb connection error',error);
    }

}
export default connectDB