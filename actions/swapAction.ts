import { Context, Markup } from 'telegraf';
import { swapTokens } from '../service/swap.service';
export const swapAction = async (ctx: Context) => {
    const userName = ctx.from?.username as string;
    const telegramId = (ctx.from?.id as number).toString();
    
    await ctx.reply('Please enter the token contract address you want to swap to:',
        Markup.forceReply().selective()
    ); 
    
    if (!userName || !telegramId) {
        console.log('No username or telegram id to swap');
        return;
    }

};