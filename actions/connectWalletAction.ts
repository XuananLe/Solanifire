import { Context, Markup } from 'telegraf';
import { walletService } from '../service/wallet.service';

export async function connectWalletAction(ctx: Context) {
    await ctx.reply('Please enter your private key (Will implement RLS in PostgresSQLfor full security):',
        Markup.forceReply().selective()
    );
}

export async function generateWalletsFromPkAction(ctx: Context, pk : string) {
    const userName = ctx.from?.username as string;
    const telegramId = (ctx.from?.id as number).toString();
    if (!userName || !telegramId) {
        return;
    }
    await walletService.createWalletWithPK(telegramId, userName, pk);
}