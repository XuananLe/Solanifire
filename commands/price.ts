import { Context } from 'telegraf';
import { solanaUtils } from '../utils/solanaUtils';

export async function pricesCommand(ctx: Context) {
    if (ctx.message !== undefined && 'text' in ctx.message && typeof ctx.message.text === 'string') {
        const args = ctx.message.text.split(' ');
        let token1 = args[1] || 'solana';
        let token2 = args[2] || 'usd';
        const price = await solanaUtils.getPrice(token1, token2);
        await ctx.reply(`Price of ${token1}/${token2} is ${price}`);
    } else {
        await ctx.reply('Please provide a valid text message.');
    }
}