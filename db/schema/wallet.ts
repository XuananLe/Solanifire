import {
    serial,
    text,
    pgTable,
} from 'drizzle-orm/pg-core';
export const wallets = pgTable('wallets', {
    id: serial('id').primaryKey(),
    mnemonic: text('mnemonic').notNull(),
    telegramId: text('telegram_id').notNull(),
    address: text('address').unique().notNull(),
    walletPk: text('wallet_pk').notNull(),
});