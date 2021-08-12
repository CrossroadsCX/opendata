import streamZippedFileToBucket from './src/voterstats/streamToBucket.js';
import pullLinks from './src/voterstats/scrapeLinks.js';

const testUrl = 'https://s3.amazonaws.com/dl.ncsbe.gov/ENRS/2020_11_03/voter_stats_20201103.zip'

// streamZippedFileToBucket(testUrl, 'gs://voterstats-historical')

pullLinks('https://www.ncsbe.gov/results-data/voter-registration-data')