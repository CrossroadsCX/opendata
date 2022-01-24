import type { Context } from '@google-cloud/functions-framework';
export declare type PubSubAttributes = {
    bucketId: string;
    eventTime: string;
    eventType: string;
    notificationConfig: string;
    objectGeneration: string;
    objectId: string;
    payloadFormat: string;
};
export declare type PubSubMessage = {
    data: string;
    attributes: PubSubAttributes;
    messageId: string;
    publishTime: string;
    orderingKey: string;
};
export interface PubSubEventFunction {
    (data: PubSubMessage, context: Context): any;
}
export declare const transactionsStaging: PubSubEventFunction;
