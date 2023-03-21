import mongoose, { ConnectOptions } from 'mongoose';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class DatabaseUtils {
    public static async connectDB(): Promise<void> {
        try {
            await mongoose.connect(Config.mongoUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as ConnectOptions);
            console.log(`Connected to MongoDB at ${Config.mongoUri}`);
        } catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
}
