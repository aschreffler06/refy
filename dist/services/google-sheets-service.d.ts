export declare class GoogleSheetsService {
    private static instance;
    private sheets;
    private spreadsheetId;
    private range;
    private constructor();
    static getInstance(): GoogleSheetsService;
    readSheet(spreadsheetId: string, range: string): Promise<any>;
    writeSheet(spreadsheetId: string, range: string, values: any[][]): Promise<any>;
    appendToSheet(values: any[][]): Promise<any>;
}
