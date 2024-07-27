import { Context } from 'telegraf';
import { walletService } from '../service/wallet.service';
import { solanaUtils } from '../utils/solanaUtils';
import * as web3 from "@solana/web3.js";
export const reloadWalletAction = async (ctx: Context) => {
    const userName = ctx.from?.username as string;
    const telegramId = (ctx.from?.id as number).toString();
    if (!userName || !telegramId) {
        return;
    }
    const wallets = await walletService.listAllWallets(telegramId);
    if (wallets.length === 0) {
        await ctx.reply('You need to create a wallet first, type /wallets');
        return;
    }
    else {
        await Promise.all(wallets.map(async (result) => {
            const balance = await solanaUtils.getBalance(new web3.PublicKey(result.address));
            await ctx.reply(
        `Address: ${result.address}, Balance: ${balance} SOL \n`);
        }));
    }

};