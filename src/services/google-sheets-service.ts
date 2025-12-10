// eslint-disable-next-line import/no-extraneous-dependencies
import { google } from 'googleapis';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class GoogleSheetsService {
    private static instance: GoogleSheetsService;
    private sheets;
    private spreadsheetId = '1-Y-h1U3iLOANJ4n9yus4PmrKFIfpi9g2ZXK64DQPmF0';
    private range = `'Form Responses 1'!A:F`;

    private constructor() {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: Config.googleSheets.clientEmail,
                private_key: Config.googleSheets.privateKey.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        this.sheets = google.sheets({ version: 'v4', auth });
    }

    public static getInstance(): GoogleSheetsService {
        if (!GoogleSheetsService.instance) {
            GoogleSheetsService.instance = new GoogleSheetsService();
        }
        return GoogleSheetsService.instance;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public async readSheet(spreadsheetId: string, range: string) {
        const response = await this.sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
        });
        return response.data.values;
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public async writeSheet(spreadsheetId: string, range: string, values: any[][]) {
        const resource = {
            values,
        };
        const response = await this.sheets.spreadsheets.values.update({
            spreadsheetId,
            range,
            valueInputOption: 'USER_ENTERED', // This interprets data types correctly
            requestBody: resource,
        });
        return response.data;
    }

    // Append rows to specific columns
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    public async appendToSheet(values: any[][]) {
        console.log(`Appending to Google Sheets: ${JSON.stringify(values)}`);
        const response = await this.sheets.spreadsheets.values.append({
            spreadsheetId: this.spreadsheetId,
            range: this.range,
            valueInputOption: 'USER_ENTERED', // This interprets data types correctly
            requestBody: {
                values,
            },
        });
        return response.data;
    }
}
