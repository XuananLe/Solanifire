import { Config } from "./config";
import { botDescription, commandList } from "./const";
import { startCommand } from "./commands/start";
import { pricesCommand } from "./commands/price";
import { walletsCommand } from "./commands/wallets";
import { generateWalletsAction } from "./actions/generateWalletsAction";
import { closeAction } from "./actions/closeAction";
import { connectWalletAction, generateWalletsFromPkAction } from "./actions/connectWalletAction";
import { deleteWalletsAction } from "./actions/deleteWalletsAction";
import { Markup, Telegraf, session } from "telegraf";
import { telegrafThrottler } from 'telegraf-throttler';
import { callbackQuery, message } from "telegraf/filters";
import { swapCommand } from "./commands/swap";
import { swapAction } from "./actions/swapAction";
import type { BotContext } from "./types";
import { reloadWalletAction } from "./actions/reloadWalletAction";
import { messageHandler } from "./handlers/messageHandler";
import { handleCallbackQuery } from "./handlers/callbackHandler";
import { getWalletsAction } from "./actions/getWalletsAction";



const bot = new Telegraf<BotContext>(Config.TELEGRAM_API_KEY)
const throttler = telegrafThrottler();

// MIDDLEWARE
bot.use(throttler);
bot.use(session());


// INITIAL SETTING (Set description and commands)
await bot.telegram.setMyDescription(botDescription)
await bot.telegram.setMyCommands([
    {
        "command": commandList.prices,
        "description": "Get the prices of any 2 token (default SOL/USDC)"
    },
    {
        "command": commandList.wallets,
        "description": "Create your first wallet or connect to your wallet"
    },
    {
        "command": commandList.start,
        "description": "Start your journey"
    },
    {
        "command": commandList.help,
        "description": "Get help"
    },
    {
        "command": commandList.swap,
        "description": "Swap tokens"
    }
])

// THIS IS THE ENTRY POINT


bot.command(commandList.start, startCommand);
bot.command(commandList.prices, pricesCommand);
bot.command(commandList.wallets, walletsCommand);
bot.command(commandList.swap, swapCommand);


// ACTIONS
bot.action('connect_wallet', (ctx) => connectWalletAction(ctx));
bot.action('generate_5_wallets', (ctx) => generateWalletsAction(ctx, 5));
bot.action('generate_10_wallets', (ctx) => generateWalletsAction(ctx, 10));
bot.action('generate_new_wallet', (ctx) => generateWalletsAction(ctx, 1));
bot.action('close', (ctx) => closeAction(ctx));
bot.action('reload_list', (ctx) => reloadWalletAction(ctx));
bot.action('delete_wallets', (ctx) => getWalletsAction(ctx));
bot.action('swap', (ctx) => swapAction(ctx));



// On text message
// REPLIES: Can be replaced with Scenes/Wizards models
bot.on(message("text"), async (ctx) => messageHandler(ctx));

bot.on('callback_query', async (ctx) => handleCallbackQuery(ctx));


// Start the bot
await bot.launch()


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

