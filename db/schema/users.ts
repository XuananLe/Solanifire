import {
    pgTable,
    serial,
    text,
    timestamp
} from 'drizzle-orm/pg-core';


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    telegramId: text('telegram_id').unique().notNull(),
    username: text('username').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});