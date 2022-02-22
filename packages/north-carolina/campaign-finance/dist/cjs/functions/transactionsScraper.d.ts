import type { CloudFunctionsContext } from '@google-cloud/functions-framework/build/src/functions';
declare type ScraperAttributes = {
    to: string;
    from: string;
    type: 'rec' | 'exp' | 'all';
};
declare type ScraperInput = {
    attributes: ScraperAttributes;
    message: {
        attributes: ScraperAttributes;
        data: string;
    };
};
interface ScraperEventFunction {
    (data: ScraperInput, context: CloudFunctionsContext): Promise<void>;
}
export declare const transactionsScraper: ScraperEventFunction;
export {};
