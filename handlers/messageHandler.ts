import { type BotContext } from '../types';
import { Markup } from 'telegraf';
import { walletService } from '../service/wallet.service';
import { generateWalletsFromPkAction } from '../actions/connectWalletAction';
import { solanaUtils } from '../utils/solanaUtils';

export async function messageHandler(ctx: BotContext) {
    initializeSession(ctx);
    // @ts-ignore
    const replyToMessageText = ctx.message?.reply_to_message?.text as string;


    // This is the list of handlers that will be called based on the reply to message text
    const handlers: { [key: string]: (ctx: BotContext) => Promise<void> } = {
        'Please enter your private key (Will implement RLS in PostgresSQLfor full security):': handlePrivateKeyInput,
        'Please enter the token contract address you want to swap to:': handleTokenAddressInput,
        'Please enter the amount you want to swap': handleAmountInput,
        'Please enter the slippage': handleSlippageInput
    };

    const handler = handlers[replyToMessageText];
    if (handler) {
        await handler(ctx);
    }
}

function initializeSession(ctx: BotContext) {
    ctx.session ??= {
        amount: 0,
        slippage: 0,
        tokenContractAddress: ""
    };
}

async function handlePrivateKeyInput(ctx: BotContext) {
    // @ts-ignore
    await generateWalletsFromPkAction(ctx, ctx.message!.text);
    await ctx.reply('Wallet Generated');
}

async function handleTokenAddressInput(ctx: BotContext) {
    await ctx.reply('Please enter the amount you want to swap',
        Markup.forceReply().selective()
    );
    if (!ctx.session) return;
    // @ts-ignore
    ctx.session.tokenContractAddress = ctx.message!.text;
    // @ts-ignore
    const tokenInfo = await solanaUtils.getTokenInfo(ctx.message!.text);
    await ctx.reply(`
        Name: ${tokenInfo.name}
        Symbol: ${tokenInfo.symbol}
        Decimals: ${tokenInfo.decimals}
        Daily volume: ${tokenInfo.daily_volume}
        `);
}

async function handleAmountInput(ctx: BotContext) {
    await ctx.reply('Please enter the slippage',
        Markup.forceReply().selective()
    );
    if (!ctx.session) return;
    // @ts-ignore
    ctx.session.amount = parseInt(ctx.message!.text);

    console.log(ctx.session.amount);
}

async function handleSlippageInput(ctx: BotContext) {
    if (!ctx.session) {
        throw new Error('Session not initialized');
    }
    // @ts-ignore
    ctx.session.slippage = parseInt(ctx.message!.text);

    const userName = ctx.from?.username;
    const telegramId = ctx.from?.id?.toString();

    if (!userName || !telegramId) {
        return;
    }

    await displayWalletSelection(ctx, telegramId);
}

async function displayWalletSelection(ctx: BotContext, telegramId: string) {
    const wallets = await walletService.listAllWallets(telegramId);

    if (wallets.length === 0) {
        await ctx.reply('You need to create a wallet first');
        return;
    }

    const keyboard = Markup.inlineKeyboard(
        wallets.map(wallet => [Markup.button.callback(solanaUtils.shortenAddress(wallet.address), wallet.address)])
    );

    await ctx.reply('Please select a wallet to swap from', keyboard);
}

