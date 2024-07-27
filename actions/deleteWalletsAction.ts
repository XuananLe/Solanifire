import type { Context } from "telegraf";
import { walletService } from "../service/wallet.service";

export const deleteWalletsAction = async (ctx : Context) => {
    const telegramId = (ctx.from?.id as number).toString();
    await ctx.reply('Deleting all wallets...');
    await ctx.reply('All wallets deleted.');
    await walletService.deleteAllWallets(telegramId);
}