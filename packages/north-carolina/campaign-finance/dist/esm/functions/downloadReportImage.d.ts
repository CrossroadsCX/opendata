import { Context } from '@google-cloud/functions-framework';
declare type DownloadReportImageEvent = {
    data: string;
};
interface DownloadReportImage {
    (event: DownloadReportImageEvent, context: Context): Promise<void>;
}
export declare const downloadReportImage: DownloadReportImage;
export {};
