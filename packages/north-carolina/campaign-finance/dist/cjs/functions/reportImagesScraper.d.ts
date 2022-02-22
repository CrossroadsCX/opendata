export declare type RowData = {
    committeeName: string;
    reportType: string;
    reportYear: string;
    imageLink: string;
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
    (data: ScraperInput): Promise<RowData[]>;
}
export declare const reportImagesScraper: ReportImagesScraper;
export {};
