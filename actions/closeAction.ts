import { Context } from 'telegraf';

export function closeAction(ctx: Context) {
    ctx.answerCbQuery();
    ctx.deleteMessage();
}