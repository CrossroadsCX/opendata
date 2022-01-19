# campaign-finance

## Development

### Building Functions
Each function is build using typescript and lives in the `src` directory. The functions are bundled separately using webpack into `dist`.

The root `index.js` file imports the commonjs versions of the functions from `dist/cjs/<function_name>.js` and are referenced by name.

### Deploying
The `gcloud functions deploy` command accepts a function name as exported in the `index.js` file. The deployment instructions are below.

#### Event Functions
**First Time Deployment**
First time deployments for each function must specify the function configurations for type, runtime, and trigger topic. Subsequent deployments can ignore those cli options.
`gcloud functions deploy <function_name> --runtime=nodejs16 --trigger-topic=<trigger_topic_name>`

and subsequent deployments can simply be done using
`gcloud functions deploy <function_name>`
#### HTTP Functions
_coming soon_
