"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const inquirer_1 = (0, tslib_1.__importDefault)(require("inquirer"));
const path_1 = (0, tslib_1.__importDefault)(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const exec = (0, util_1.promisify)(child_process_1.exec);
const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;
exports.command = 'deploy [name]';
exports.describe = 'Deploy a function';
exports.handler = () => (0, tslib_1.__awaiter)(void 0, void 0, void 0, function* () {
    console.log('Building functions...');
    const { stdout: buildLogs } = yield exec('yarn build');
    console.log(buildLogs);
    const { stdout, stderr } = yield exec('npm prefix');
    const rootPath = stdout.trim();
    const functions = require(path_1.default.resolve(rootPath, 'index'));
    const functionNames = Object.keys(functions);
    const answers = yield inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'functionName',
            choices: functionNames,
        },
    ]);
    const { functionName } = answers;
    console.log(`Deploying ${functionName}. This may take up to 2 minutes...`);
    const { stdout: deployLog, stderr: deployErr } = yield exec(`gcloud functions deploy ${functionName}`);
    console.log(deployLog);
    console.log(deployErr);
});
//# sourceMappingURL=deployFunction.js.map