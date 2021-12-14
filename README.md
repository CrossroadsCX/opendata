# opendata
Sets of open data tools and infrastructure for handling open data - from campaign finance to voter data

## Infrastructure
All code provided in this repo has been designed to work with products provided by [Google Cloud Platform ( GCP )](https://cloud.google.com). We have done our best to decscribe the infrastructure these tools run on. If you still have questions, please open an issue requesting documentation updates.
## Packages

### North Carolina
First of all, many thanks to the team at the [North Carolina State Board of Elections](https://ncsbe.gov) for all of their work in maintaining public records for the State of North Carolina. Without their team our efforts in North Carolina would be impossible.

These set of packages have been created to interact with various data publications provided by the NCSBE. They are designed to pull, aggregate, and analyze public data in North Carolina.

#### [NC Campaign Finance](./packages/north-carolina/campaign-finance)
This package contains a set of cloud functions and infrastructure descriptions to pull, aggregate, clean, and analyze campaign finance data from ncsbe.gov

#### [NC Voter Data](./packages/north-carolina/voter-data)
__Note: Still on yarn v1.x__

This package contains a cloud function that runs on a scheduler. This cloud function pipes the latest voterfile from ncsbe.gov to a cloud storage bucket.

### [Google Cloud](./packages/google-cloud)
This package contains utility tools to assist all packages interacting with GCP infrastructure.

### [Utils](./packages/utils)
This package contains utility tools shared across all packages. These tools serve purposes such as logging, data transformation, etc. They are intended to be domain-agnostic.

### Eslint Config
This package contains the eslint configuration for all packages.

## Development
This project utilizes standard development tools such as eslint, yarn ( berry ), and typescript. All contributors are welcome whether you are technical or not. Please feel free to open issues for bug reports, feature suggestions, etc.

Please also see our [Code of Conduct](./CODE_OF_CONDUCT.md). This repository is open source and provided for public good. Please keep all issues and comments constructive. Personal attacks and malicious feedback will not be tolerated.
