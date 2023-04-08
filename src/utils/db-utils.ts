import mongoose, { ConnectOptions } from 'mongoose';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class DatabaseUtils {
    public static async connectDB(): Promise<void> {
        try {
            const name = 'refy';
            await mongoose.connect(Config.mongoUri, {
                dbName: name,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions);
            console.log(`Connected to MongoDB at ${Config.mongoUri} and using database ${name}`);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }

    public static async connectDBForTesting(): Promise<void> {
        try {
            const name = 'test';
            await mongoose.connect(Config.mongoUri, {
                dbName: name,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions);
            console.log(`Connected to MongoDB at ${Config.mongoUri} and using database ${name}`);
        } catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
}
