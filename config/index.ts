import "dotenv/config"
import { Redis } from "@telegraf/session/redis";
import * as web3 from "@solana/web3.js"
const connection = new web3.Connection(process.env.RPC_ENDPOINT as string, 'confirmed')
export const Config = {
    Connection : connection,
    TELEGRAM_API_KEY: process.env.TELEGRAM_API_KEY as string,
    HELIUS_API_KEY: process.env.HELIUS_API_KEY as string,
    POSTGRES_STRING: process.env.POSTGRES_STRING as string,
    STORE: Redis({
        url: process.env.REDIS_URL as string,
    }),
    // Demo Purpose Only, This Endpoint will be removed
    RPC_ENDPOINT: process.env.RPC_ENDPOINT as string, 
    MASTER_PK: process.env.MASTER_PK as string,
}