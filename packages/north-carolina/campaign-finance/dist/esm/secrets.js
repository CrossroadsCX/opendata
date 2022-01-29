import { __awaiter } from "tslib";
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { logger } from './logger';
const client = new SecretManagerServiceClient();
export const getSecret = (secretName, projectName) => __awaiter(void 0, void 0, void 0, function* () {
    const name = `projects/${projectName}/secrets/${secretName}/versions/latest`;
    function accessSecret() {
        return __awaiter(this, void 0, void 0, function* () {
            const [version] = yield client.accessSecretVersion({
                name,
            });
            if (version.payload && version.payload.data) {
                const payload = version.payload.data.toString();
                return payload;
            }
            else {
                logger.error(`Error retrieving secret - ${secretName}`, { secretName, projectName });
                throw new Error(`Error retrieving secret - ${secretName}`);
            }
        });
    }
    return accessSecret();
});
//# sourceMappingURL=secrets.js.map