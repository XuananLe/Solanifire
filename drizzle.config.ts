import { defineConfig } from 'drizzle-kit';
import { Config } from './config';

export default defineConfig({
  schema: './db/schema/*.ts',
  out: './drizzle',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url : Config.POSTGRES_STRING
  },
});
