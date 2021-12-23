# campaign-finance

## Development

### Building Functions
Each function is build using typescript and lives in the `src` directory. The functions are bundled separately using webpack into `dist/<source-file-name-minus-extension>/function.js`. Any function dependencies are included in the resulting function bundle.

Google Cloud Functions deployment aren't able to handle [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/) dependencies, and thus all code must be bundled to commonjs before deployment

### Deploying
`gcloud functions deploy --runtime=nodejs16 --source=dist/<source-file-name-minus-extension>`

Example:
Assuming a source file at `src/example.js`:
* `yarn webpack` - build the function bundle at `dist/example/function.js`
* `gcloud functions deploy --runtime=nodejs16 --source=dist/example`
