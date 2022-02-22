import { __awaiter } from "tslib";
import inquirer from 'inquirer';
import path from 'path';
import { execSync } from 'child_process';
const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;
exports.command = 'deploy [name]';
exports.describe = 'Deploy a function';
exports.handler = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Building functions...');
    execSync('yarn build').toString();
    const rootPath = execSync('npm prefix').toString().trim();
    const functions = require(path.resolve(rootPath, 'index'));
    const functionNames = Object.keys(functions);
    const answers = yield inquirer.prompt([
        {
            type: 'list',
            name: 'functionName',
            choices: functionNames,
        },
    ]);
    const { functionName } = answers;
    execSync(`gcloud functions deploy ${functionName}`, { stdio: 'inherit' });
});
//# sourceMappingURL=deployFunction.js.map