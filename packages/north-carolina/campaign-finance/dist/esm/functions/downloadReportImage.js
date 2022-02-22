import { __awaiter } from "tslib";
import { logger } from '../utils/logger';
const destBucket = 'raw-report-images';
export const downloadReportImage = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    logger.info(event);
    logger.info(context);
    const imageDataString = Buffer.from(event.data, 'base64').toString();
    const imageData = JSON.parse(imageDataString);
    const { imageLink } = imageData;
    logger.info(imageLink);
});
//# sourceMappingURL=downloadReportImage.js.map