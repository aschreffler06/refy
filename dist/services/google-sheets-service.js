// eslint-disable-next-line import/no-extraneous-dependencies
import { google } from 'googleapis';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');
export class GoogleSheetsService {
    constructor() {
        this.spreadsheetId = '1-Y-h1U3iLOANJ4n9yus4PmrKFIfpi9g2ZXK64DQPmF0';
        this.range = `'Form Responses 1'!A:F`;
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: Config.googleSheets.clientEmail,
                private_key: Config.googleSheets.privateKey.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        this.sheets = google.sheets({ version: 'v4', auth });
    }
    static getInstance() {
        if (!GoogleSheetsService.instance) {
            GoogleSheetsService.instance = new GoogleSheetsService();
        }
        return GoogleSheetsService.instance;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async readSheet(spreadsheetId, range) {
        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        return response.data.values;
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async writeSheet(spreadsheetId, range, values) {
        const resource = {
            values,
        };
        const response = await this.sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: resource,
        });
        return response.data;
    }
    // Append rows to specific columns
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    async appendToSheet(values) {
        console.log(`Appending to Google Sheets: ${JSON.stringify(values)}`);
        const response = await this.sheets.spreadsheets.values.append({
            spreadsheetId: this.spreadsheetId,
            range: this.range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values,
            },
        });
        return response.data;
    }
}
//# sourceMappingURL=google-sheets-service.js.map