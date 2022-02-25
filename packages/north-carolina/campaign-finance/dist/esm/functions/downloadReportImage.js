import { __awaiter } from "tslib";
import { streamFileToGCS } from '../helpers/streamFileToGCS';
import { logger } from '../utils/logger';
const destBucket = 'raw-report-images';
export const downloadReportImage = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info(event);
    logger.info(context);
    const { eventId } = context;
    logger.info(eventId);
    const imageDataString = Buffer.from(event.data, 'base64').toString();
    const imageData = JSON.parse(imageDataString);
    const { committeeName, imageLink, reportYear, reportType } = imageData;
    const requestOptions = {
        method: 'GET',
        url: imageLink,
    };
    const options = {
        contentType: 'application/pdf'
    };
    const filename = `${reportYear}/${reportType}/${committeeName}.pdf`;
    logger.info(`Streaming file from ${imageLink} to ${destBucket}`);
    const result = yield streamFileToGCS(requestOptions, destBucket, filename, options);
    logger.info(result);
});
//# sourceMappingURL=downloadReportImage.js.map