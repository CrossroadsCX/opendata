"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = void 0;
const tslib_1 = require("tslib");
const secret_manager_1 = require("@google-cloud/secret-manager");
const logger_1 = require("./logger");
const client = new secret_manager_1.SecretManagerServiceClient();
const getSecret = (secretName, projectName) => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const name = `projects/${projectName}/secrets/${secretName}/versions/latest`;
    function accessSecret() {
        return (0, tslib_1.__awaiter)(this, void 0, void 0, function* () {
            const [version] = yield client.accessSecretVersion({
                name,
            });
            if (version.payload && version.payload.data) {
                const payload = version.payload.data.toString();
                return payload;
            }
            else {
                logger_1.logger.error(`Error retrieving secret - ${secretName}`, { secretName, projectName });
                throw new Error(`Error retrieving secret - ${secretName}`);
            }
        });
    }
    return accessSecret();
});
exports.getSecret = getSecret;
//# sourceMappingURL=secrets.js.map