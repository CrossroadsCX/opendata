"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const storage_1 = require("@google-cloud/storage");
const projectId = 'open-campaign-finance';
exports.storage = new storage_1.Storage({ projectId });
//# sourceMappingURL=storage.js.map