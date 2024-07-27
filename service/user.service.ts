import { db } from '../db';
import { eq } from 'drizzle-orm';
import { schema } from '../db/schema';
const createUser = async (username: string, telegramId: string) => {
    if (!username) {
        throw new Error("username is required");
    }
    if (!telegramId) {
        throw new Error("telegramId is required");
    }
    
    if (await checkifUserExists(telegramId)) {
        console.log(`User with telegramId ${telegramId} already exists`);
        return;
    }
    
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.username, username));
    if (existingUser.length > 0) {
        console.log(`User with username ${username} already exists`);
        return;
    }
    
    await db.insert(schema.users).values({
        telegramId: telegramId,
        username: username
    });
    
    return { username, telegramId };
}
const checkifUserExists = async (telegramId: string) => {
    let res = await db.select().from(schema.users).where(eq(schema.users.telegramId, telegramId));
    if (res.length > 0) {
        return true;
    }
    return false;
}

const findUser = async (telegramId: string) => {
    let res = await db.select().from(schema.users).where(eq(schema.users.telegramId, telegramId));
    return res;
};



export const userService = {
    createUser,
    checkifUserExists,
    findUser
};