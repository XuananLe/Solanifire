import { Context } from 'telegraf';
import { walletService } from '../service/wallet.service';

export async function generateWalletsAction(ctx: Context, count: number) {
    const telegramId = (ctx.from?.id as number).toString();
    const userName = ctx.from?.username as string;
    ctx.answerCbQuery();
    if (count <= 0) {
        await ctx.reply('Please provide a valid number of wallets to generate.');
        return;
    }
    if (count === 1) {
        let result = await walletService.createWallet(telegramId, userName);
        await ctx.reply(`Wallet Generated: \n${result.address} \n - ${result.walletPk}`);
        return;
    }

    let results = await walletService.createWalletBulk(telegramId, userName, count);
    await ctx.reply(`${count} Wallets Generated: \n`);
    await ctx.reply(`${results.map((result, index) => `${index + 1}. ${result.address} \n - ${result.walletPk}`).join('\n')}`);
}   