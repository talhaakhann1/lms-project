import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config({
   path:"./.env"
})

console.log(process.env.REDIS_URL);


const redisClient = createClient({
  url: process.env.REDIS_URL!,
  RESP: 2,
});


redisClient.on("error",(err)=>{
    console.log("Redis Error ",err)
})

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis connected");
  }
};


export default redisClient