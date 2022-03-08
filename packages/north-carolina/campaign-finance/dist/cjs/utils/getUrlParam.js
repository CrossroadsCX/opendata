"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlParam = void 0;
const url_1 = require("url");
const getUrlParam = (url, param) => {
    const urlObject = new url_1.URL(url);
    const { searchParams } = urlObject;
    return searchParams.get(param);
};
exports.getUrlParam = getUrlParam;
//# sourceMappingURL=getUrlParam.js.map