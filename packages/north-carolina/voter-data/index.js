require('regenerator-runtime/runtime');

// eslint-disable-next-line node/no-unpublished-require
const streamFileToGCS = require('./dist/voterstats/streamToBucket.js').default;

module.exports = {
  streamFileToGCS,
};
