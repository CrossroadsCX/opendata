"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yargs_1 = (0, tslib_1.__importDefault)(require("yargs"));
yargs_1.default
    .commandDir('./commands')
    .demandCommand()
    .help()
    .argv;
//# sourceMappingURL=index.js.map