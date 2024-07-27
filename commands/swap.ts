import { Context } from 'telegraf';
export async function swapCommand(ctx: Context) {
    await ctx.reply('Trade Options', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Buy', callback_data: 'swap' }, { text: 'Sell', callback_data: 'swap' }],
                [{ text: 'Close', callback_data: 'close' }]
            ]
        }
    });
}