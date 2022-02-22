export declare type GCSFileInfo = {
    bucketName: string;
    fileName: string;
};
export declare const copyGCSFile: (sourceFileInfo: GCSFileInfo, destFileInfo: GCSFileInfo) => Promise<void>;
