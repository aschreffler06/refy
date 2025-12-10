import mongoose from 'mongoose';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
export class DatabaseUtils {
    static async connectDB() {
        try {
            const name = 'refy';
            await mongoose.connect(Config.mongoUri, {
                dbName: name,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`Connected to MongoDB at ${Config.mongoUri} and using database ${name}`);
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    }
    static async connectDBForTesting() {
        try {
            const name = 'test';
            await mongoose.connect(Config.mongoUri, {
                dbName: name,
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log(`Connected to MongoDB at ${Config.mongoUri} and using database ${name}`);
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
    static async disconnectDBForTesting() {
        try {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
    }
}
//# sourceMappingURL=db-utils.js.map