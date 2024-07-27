import type { BotContext } from '../types';
import { solanaUtils } from '../utils/solanaUtils';
import { walletService } from '../service/wallet.service';
import { swapTokens } from '../service/swap.service';
import * as web3 from '@solana/web3.js';

export async function handleCallbackQuery(ctx: BotContext) {
    if (!ctx.callbackQuery || !('data' in ctx.callbackQuery)) {
        await ctx.answerCbQuery('Invalid callback query');
        return;
    }

    const walletAddress = ctx.callbackQuery.data;
    await ctx.answerCbQuery(); // Acknowledge the callback query

    try {
        await displayWalletInfo(ctx, walletAddress);
        await performSwap(ctx, walletAddress);
    } catch (error) {
        await handleError(ctx, error);
    }
}

async function displayWalletInfo(ctx: BotContext, walletAddress: string) {
    await ctx.reply(`You have selected the wallet: ${walletAddress}`);
    const balance = await solanaUtils.getBalance(new web3.PublicKey(walletAddress));
    if (balance === 0) {
        await ctx.reply('Wallet has no balance, The transaction will fail. Consider funding the wallet.');
    }
    else {
        await ctx.reply(`Balance: ${balance} SOL`);
    }

}

async function performSwap(ctx: BotContext, walletAddress: string) {
    const pk = await getPrivateKey(walletAddress);
    await ctx.reply('Swapping... Finding the best route...');

    const swapParams = getSwapParams(ctx, pk);
    const txId = await swapTokens(swapParams);

    await displaySwapResult(ctx, txId);
}

async function getPrivateKey(walletAddress: string): Promise<string> {
    const wallet = await walletService.getWalletFromAddress(walletAddress);
    if (!wallet || wallet.length === 0) {
        throw new Error('Wallet not found');
    }
    return wallet[0].walletPk;
}

function getSwapParams(ctx: BotContext, privateKey: string) {
    if (!ctx.session?.amount || !ctx.session?.slippage || !ctx.session?.tokenContractAddress) {
        throw new Error('Missing swap parameters in session');
    }

    return {
        amount: ctx.session.amount,
        slippageBps: ctx.session.slippage,
        outputMint: ctx.session.tokenContractAddress,
        privateKey: privateKey
    };
}

async function displaySwapResult(ctx: BotContext, txId: string) {
    await ctx.reply(`View the transaction here: https://solscan.io/tx/${txId}`);
    await ctx.reply('Swapped!');
}

async function handleError(ctx: BotContext, error: any) {
    console.error('Error in callback query handler:', error);
    await ctx.reply(`An error occurred: ${error.message}`);
}