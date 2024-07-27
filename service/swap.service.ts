import { clusterApiUrl, Connection, Keypair, sendAndConfirmRawTransaction, VersionedTransaction } from '@solana/web3.js';
import fetch from 'cross-fetch';
import { Wallet, web3 } from '@project-serum/anchor';
import bs58 from 'bs58';
import { Config } from '../config';


export interface SwapRequest {
    inputMint: string;
    outputMint: string;
    amount: number;
    slippageBps: number;
    privateKey: string;
    rpcEndpoint: string;
}

export const defaultSwapRequest: SwapRequest = {
    inputMint: "So11111111111111111111111111111111111111112",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount: 10000, // 0.1 SOL (in lamports)
    slippageBps: 50, // 0.5% slippage
    privateKey: process.env.PRIVATE_KEY as string,
    rpcEndpoint: Config.RPC_ENDPOINT as string
};

export interface SwapResponse {
    txid: string;
}



export async function swapTokens(
    swapRequest: Partial<SwapRequest>
): Promise<string> {
    // Merge default values with provided values
    const {
        inputMint,
        outputMint,
        amount,
        slippageBps,
        privateKey,
        rpcEndpoint
    } = { ...defaultSwapRequest, ...swapRequest };


    // log the request
    console.log({ inputMint, outputMint, amount, slippageBps, privateKey, rpcEndpoint });

    // Setup connection and wallet
    const connection = new Connection(rpcEndpoint, 'confirmed');
    const wallet = new Wallet(Keypair.fromSecretKey(bs58.decode(privateKey)));

    // Get quote
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`;
    const quoteResponse = await (await fetch(quoteUrl)).json();

    // Get swap transaction
    const { swapTransaction } = await (
        await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quoteResponse,
                prioritizationFeeLamports: "auto",
                userPublicKey: wallet.publicKey.toString(),
                wrapAndUnwrapSol: true,
            }),
        })
    ).json();

    // Deserialize the transaction
    const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
    let transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // sign the transaction
    transaction.sign([wallet.payer]);

    // Execute the transaction
    const rawTransaction = transaction.serialize()
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2
    });
    console.log('Transaction confirmed:', txid);
    return txid;
}

