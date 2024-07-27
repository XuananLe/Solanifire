import { Context } from 'telegraf';
import { getWalletsAction } from '../actions/getWalletsAction';

export async function walletsCommand(ctx: Context) {
    
    await getWalletsAction(ctx);

    await ctx.reply('Wallet Options', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'Connect Wallet', callback_data: 'connect_wallet' }, { text: 'Generate New Wallet', callback_data: 'generate_new_wallet' }],
                [{ text: 'Generate 5 Wallets', callback_data: 'generate_5_wallets' }, { text: 'Generate 10 Wallets', callback_data: 'generate_10_wallets' }],
                [{ text: 'Transfer All SOL To One', callback_data: 'transfer_all_sol_to_one' }],
                [{ text: 'Reload List', callback_data: 'reload_list' }],
                [{ text: 'Delete Wallets', callback_data: 'delete_wallets' }],
                [{ text: 'Close', callback_data: 'close' }]
            ]
        }
    });
}