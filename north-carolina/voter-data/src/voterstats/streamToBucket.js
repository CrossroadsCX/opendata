import https from 'https';
import path from 'path';
import { Storage } from '@Google-cloud/storage';

export default function streamZippedFileToBucket(targetUrl, bucketName) {
    const fileName = path.basename(targetUrl)

    const storage = new Storage()
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    https.get(targetUrl, function(res) {
        res.pipe(
            file.createWriteStream({
                resumable: false,
                public: false,
                metadata: {
                    contentType: res.headers['content-type']
                }
            })
        );
    })
};