"use strict";
exports.__esModule = true;
exports.storage = void 0;
var storage_1 = require("@google-cloud/storage");
var projectId = process.env.projectId;
exports.storage = new storage_1.Storage({ projectId: projectId });
