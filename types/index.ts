import type { Context } from "telegraf";

export type tokenInfo = {
    "address": string
    "name": string,
    "symbol": string,
    "decimals": number,
    "daily_volume": number,
} 


// You can define your own SessionData interface
interface SessionData {
    tokenContractAddress?: string;
    amount?: number;
    slippage?: number;
}

export interface BotContext extends Context {
    session?: SessionData;
}
