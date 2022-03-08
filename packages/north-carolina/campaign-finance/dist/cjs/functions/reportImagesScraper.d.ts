import { Context } from '@google-cloud/functions-framework';
export declare type RowData = {
    committeeName: string;
    reportType: string;
    reportYear: string;
    imageLink: string;
    rowAmended: string;
    DID: string;
    rowImage: {
        href: string;
        text: string;
    };
    rowData: {
        href: string;
        text: string;
    };
};
declare type ScraperInput = {
    attributes: {
        year: string;
        code: string;
    };
    message: {
        data: string;
    };
};
interface ReportImagesScraper {
    (data: ScraperInput, context: Context): Promise<void>;
}
export declare const reportImagesScraper: ReportImagesScraper;
export {};
