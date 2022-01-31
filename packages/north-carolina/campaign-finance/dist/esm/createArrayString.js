export const createArrayString = (input) => {
    return input.reduce((prev, current, index) => {
        if (index === 0) {
            return `'${current}'`;
        }
        else {
            return `${prev},'${current}'`;
        }
    }, '');
};
//# sourceMappingURL=createArrayString.js.map