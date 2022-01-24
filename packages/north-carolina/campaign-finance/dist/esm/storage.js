import { Storage } from '@google-cloud/storage';
const { projectId } = process.env;
export const storage = new Storage({ projectId });
//# sourceMappingURL=storage.js.map