"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createArrayString = void 0;
const createArrayString = (input) => {
    return input.reduce((prev, current, index) => {
        if (index === 0) {
            return `'${current}'`;
        }
        else {
            return `${prev},'${current}'`;
        }
    }, '');
};
exports.createArrayString = createArrayString;
//# sourceMappingURL=createArrayString.js.map