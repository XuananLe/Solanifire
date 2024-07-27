import { Context, Markup } from 'telegraf';
import { botName, commandList } from '../const';
import { solanaUtils } from '../utils/solanaUtils';


export async function startCommand(ctx: Context) {
    const price = await solanaUtils.getPrice();
    const message = `
        🚀 ${botName}: Your Template Starter Bot 🤖
        Telegram | Twitter | Website
    
        ⬩ SOL: ${price} USD
    
        Create your first wallet at ${commandList.wallets}
    `;

    const keyboard = Markup.inlineKeyboard([
        [Markup.button.url('Channel', 'https://t.me/YourChannel')],
        [Markup.button.url('Chat', 'https://t.me/YourChat')],
        [Markup.button.url('X (Twitter)', 'https://twitter.com/YourTwitter')],
        [Markup.button.url('Website', 'https://yourwebsite.com')],
    ]);

    // get username and telegram id
    console.log(ctx.from?.username, ctx.from?.id);

    await ctx.reply(message, keyboard);
}

