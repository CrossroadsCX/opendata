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
export declare type StorageBackgroundEventData = {
    kind: string;
    id: string;
    selfLink: string;
    name: string;
    bucket: string;
    generation: string;
    metageneration: string;
    contentType: string;
    timeCreated: string;
    updated: string;
    storageClass: string;
    timeStorageClassUpdated: string;
    size: string;
    md5Hash: string;
    mediaLink: string;
    crc32c: string;
    etag: string;
};
export declare type PubSubMessage = {
    data: string;
    attributes: PubSubAttributes;
    messageId: string;
    publishTime: string;
    orderingKey: string;
};
export interface PubSubEventFunction {
    (event: PubSubMessage, context: Context): any;
}
export declare const transactionsSnowpipe: PubSubEventFunction;
