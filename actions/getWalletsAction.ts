import {Context} from 'telegraf';
import * as web3 from '@solana/web3.js';
import { walletService} from '../service/wallet.service';
import {solanaUtils } from '../utils/solanaUtils';

export async function getWalletsAction(ctx: Context) {
    const telegramId = (ctx.from?.id as number).toString();
    // ctx.answerCbQuery();
    let results = await walletService.listAllWallets(telegramId);
    await ctx.reply(`Your Wallets: `);
    if (results.length === 0) {
        await ctx.reply(`You have no wallets, please create one or the ones you have are not connected.`);
        return;
    }
    // get the balance of each wallet
    await Promise.all(results.map(async (result) => {
        const balance = await solanaUtils.getBalance(new web3.PublicKey(result.address));
        await ctx.reply(`
            Address: ${result.address}, Balance: ${balance} SOL \n
        `);
    }));
}