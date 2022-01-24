"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.someFunction = void 0;
const utils_1 = require("@crossroadscx/utils");
const someFunction = (req, res) => {
    utils_1.logger.log('some function logging');
    res.end();
};
exports.someFunction = someFunction;
//# sourceMappingURL=example.js.map