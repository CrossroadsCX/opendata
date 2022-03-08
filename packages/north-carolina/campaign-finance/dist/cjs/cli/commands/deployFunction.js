"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const inquirer_1 = (0, tslib_1.__importDefault)(require("inquirer"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const child_process_1 = require("child_process");
const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;
exports.command = 'deploy [name]';
exports.describe = 'Deploy a function';
exports.handler = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    const buildFunctions = yield inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'buildConfirm',
            message: 'Build functions?',
            default: true,
        }
    ]);
    const { buildConfirm } = buildFunctions;
    if (buildConfirm) {
        console.log('Building functions...');
        (0, child_process_1.execSync)('yarn build');
    }
    const rootPath = (0, child_process_1.execSync)('npm prefix').toString().trim();
    const functions = require(path_1.default.resolve(rootPath, 'index'));
    const functionNames = Object.keys(functions);
    const answers = yield inquirer_1.default.prompt([
        {
            type: 'checkbox',
            name: 'functionsToDeploy',
            choices: functionNames,
        },
    ]);
    const { functionsToDeploy } = answers;
    functionsToDeploy.forEach((functionName) => {
        (0, child_process_1.execSync)(`gcloud functions deploy ${functionName}`, { stdio: 'inherit' });
    });
});
//# sourceMappingURL=deployFunction.js.map