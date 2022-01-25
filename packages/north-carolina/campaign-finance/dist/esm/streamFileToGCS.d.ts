declare type FileOptions = {
    contentType: string;
};
export declare const streamFileToGCS: (requestOptions: Record<string, unknown>, bucketName: string, filename: string, options: FileOptions, metadata?: Record<string, unknown>) => Promise<void>;
export {};
