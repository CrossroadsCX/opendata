import type { Context } from '@google-cloud/functions-framework';
declare type BuildEvent = {
    attributes: Record<string, unknown>;
    data: string;
};
export declare const buildNotifications: (event: BuildEvent, context: Context) => Promise<void>;
export {};
