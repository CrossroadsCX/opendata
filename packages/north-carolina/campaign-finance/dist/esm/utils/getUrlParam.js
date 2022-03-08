import { URL } from 'url';
export const getUrlParam = (url, param) => {
    const urlObject = new URL(url);
    const { searchParams } = urlObject;
    return searchParams.get(param);
};
//# sourceMappingURL=getUrlParam.js.map