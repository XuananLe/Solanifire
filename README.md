# Solanifire
Template Telegram bot for Solana blockchain.

To install bun:
```bash
curl -fsSL https://bun.sh/install | bash
```


To install dependencies:

```bash
bun install package.json
```
To migrate and push changes to the blockchain:

```bash
bunx drizzle-kit migrate && bunx drizzle-kit push
```
To run:

```bash
bun run dev
```
You can watch some of the pictures of the bot in the `demo` folder.

Folder structure:
- `actions/` - contains all the actions that the bot can perform.
- `commands/` - contains all the commands that the bot can receive.
- `config/` - contains the configuration files.
- `db/schema/` - contains the database schema.
- `db/*.ts` - contains the database conenction and migrate logic.
- `index.ts` - the entry point of the bot.
- `types/` - contains all the types used in the project. (Session and TokenInfo)
- `utils/` - contains all the utility functions.
- `handlers/` - contains all the handlers for the bot. (Text and Callback)
- `drizzle` - contains the sql for migration 
- `const` - contains all the constants used in the project.
- `services` - contains all the services used in the project to interact with the blockchain and database.


Guide for applying the template:
- Metadata such as the bot name, description, and commands can be found in the `consts/` folder.
- Replace the `config/` folder with your own configuration files.
- Apply the correct environment variables in the `.env` file (Take a look at .env.example).
- If you want to add another command, just insert a new one in the commandList object    
- And then apply the context in the `handlers/` and `actions` folder.


This project was created using `bun init` in bun v1.1.20. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime. Blazzinggggggg fast! (Written in Zig btw) 🚀. This is the first Solana telegram bot that support the Bun runtime. I hope in the near future all Solana npm package can be adopted by Bun.

_________________________________________________________
I hope this template helps you to create your own Telegram bot for Solana blockchain.If you have any questions, feel free to ask me on [Telegram](https://telegram.me/LeXuanan). I will be happy to help you. 😊. 
