declare type DownloadReportImageEvent = {
    data: string;
};
interface DownloadReportImage {
    (event: DownloadReportImageEvent): Promise<void>;
}
export declare const downloadReportImage: DownloadReportImage;
export {};
