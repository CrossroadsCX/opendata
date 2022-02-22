declare type ScraperInput = {
    attributes: {
        year: string;
    };
    message: {
        data: string;
    };
};
interface ScraperEventFunction {
    (data: ScraperInput): Promise<void>;
}
export declare const reportsScraper: ScraperEventFunction;
export {};
