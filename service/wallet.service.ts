import { schema } from "../db/schema";
import * as web3 from "@solana/web3.js"
import { db } from "../db";
import { solanaUtils } from "../utils/solanaUtils";
import { userService } from "./user.service";
import { eq } from "drizzle-orm";
import { randomBytes } from 'crypto';
import { decryptData, encryptData } from "../utils/encryptUtils";

const createWallet = async (
    telegramId: string, userName: string
) => {
    if (!telegramId || !userName) {
        throw new Error(`telegramId and userName are required`);
    }
    const userExists = await userService.checkifUserExists(telegramId);

    if (!userExists) {
        await userService.createUser(userName, telegramId);
    }
    const wallet = new web3.Keypair();
    const address = wallet.publicKey.toString();
    const walletPk = solanaUtils.pkToString(wallet);

    await db.insert(schema.wallets).values({ address, walletPk, mnemonic: "", telegramId });
    return { address, walletPk };
};


const createWalletWithPK = async (
    telegramId: string,
    userName: string,
    walletPk: string
) => {
    if (!telegramId || !userName || !walletPk) {
        throw new Error(`telegramId, userName and walletPk are required`);
    }

    // First, ensure the user exists
    const userExists = await userService.checkifUserExists(telegramId);

    if (!userExists) {
        // If the user doesn't exist, create them first
        await userService.createUser(userName, telegramId);
    }

   // Now that we're sure the user exists, create the wallet
   const wallet =  solanaUtils.retreiveWallet(walletPk);
   const address = wallet.publicKey.toString();

    try {
        await db.insert(schema.wallets).values({
            address,
            walletPk,
            mnemonic: "",
            telegramId
        });
    } catch (error) {
        console.error('Error inserting wallet:', error);
    }

    return { address, walletPk };
}


const createWalletBulk = async (telegramId: string, userName: string, nums: number) => {
    if (!telegramId || !userName) {
        throw new Error(`telegramId and userName are required`);
    }
    const userExists = await userService.checkifUserExists(telegramId);
    if (!userExists) {
        await userService.createUser(userName, telegramId);
    }
    if (![5, 10].includes(nums)) {
        throw new Error("nums can only be 5 or 10");
    }
    const wallets = Array.from({ length: nums },
        () => new web3.Keypair());
    const result = wallets.map(wallet => ({
        address: wallet.publicKey.toString(),
        walletPk: solanaUtils.pkToString(wallet)   
     }));

    try {
        await Promise.all(wallets.map(wallet =>
            db.insert(schema.wallets).values({
                address: wallet.publicKey.toString(),
                walletPk: solanaUtils.pkToString(wallet),
                mnemonic: "",
                telegramId
            })
        ));
        console.log(result);
    } catch (err) {
        console.error(err);
    }

    return result;
};


const listAllWallets = async (telegramId: string) => {
    const wallets = await db.select(
        {
            address: schema.wallets.address,
            walletPk: schema.wallets.walletPk,
        }
    ).from(schema.wallets).where(
        eq(schema.wallets.telegramId, telegramId)
    );
    return wallets.length === 0 ? [] : wallets;
};



const deleteAllWallets = async (telegramId: string) => {
    await db.delete(schema.wallets).where(
        eq(schema.wallets.telegramId, telegramId)
    );
}

const getWalletFromAddress = async (address: string) => {
    const wallet = await db.select(
        {
            address: schema.wallets.address,
            walletPk: schema.wallets.walletPk,
            mnemonic: schema.wallets.mnemonic,
            telegramId: schema.wallets.telegramId
        }
    ).from(schema.wallets).where(
        eq(schema.wallets.address, address)
    );
    return wallet.length === 0 ? [] : wallet;
};


export const walletService = {
    createWallet,
    createWalletWithPK,
    createWalletBulk,
    listAllWallets,
    getWalletFromAddress,
    deleteAllWallets
}

