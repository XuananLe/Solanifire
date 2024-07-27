import { base58 } from '@scure/base';
import * as web3 from "@solana/web3.js";
import { Config } from '../config';
import axios from 'axios';
import type { tokenInfo } from '../types';

const pkToString = (pk: web3.Keypair) => {
    return base58.encode(pk.secretKey);
}

// retreiveWallet will return a keypair from a string
const retreiveWallet = (str: string): web3.Keypair => {
    console.log(`Retreiving wallet from ${str}`);
    return web3.Keypair.fromSecretKey(
        base58.decode(
            str
        )
    )
}
const getBalance = async (pk: web3.PublicKey) => {
    return await Config.Connection.getBalance(pk) / web3.LAMPORTS_PER_SOL;
}

function shortenAddress(address: string): string {
    return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

const getPrice = async (currency: string = "solana", vs_currencies : string = "usd"): Promise<number | null> => {
    const url = `https://api.coingecko.com/api/v3/simple/price`;
    try {
        const response = await axios.get(url, {
            params: {
                ids: currency.toLowerCase(), // CoinGecko API uses lower case for currency ids
                vs_currencies: vs_currencies // You can change 'usd' to any other currency if needed
            }
        });

        // Extracting the price from the response
        const price = response.data[currency.toLowerCase()]?.usd; // Adjust according to the response structure
        return price ?? null;
    } catch (error) {
        console.error('Error fetching price:', error);
        return null;
    }
};

const getTokenInfo = async (tokenAddress: string) : Promise<tokenInfo> => {
    const res = await fetch(`https://tokens.jup.ag/token/${tokenAddress}`);
    const data = await res.json();
    return {
        "address" : data.address,
        "name" : data.name,
        "symbol" : data.symbol,
        "decimals" : data.decimals,
        "daily_volume" : data.daily_volume
    } as tokenInfo;
}


export const solanaUtils = {
    getTokenInfo: getTokenInfo,
    getPrice: getPrice,
    shortenAddress: shortenAddress,
    pkToString: pkToString,
    retreiveWallet: retreiveWallet,
    getBalance: getBalance
}
