# North Carolina Campaign Finance CLI

## Using the CLI
* Run `yarn cli` to see available options

### Deploy Command
Run `yarn cli deploy` to see available functions for deployment. This command pulls the function names from the `index.js` file in the root of the package and uses the `gcloud functions deploy` cli tool to execute the deployments.

## Development
The cli is built in typescript, so any new code will need to get built into the dist directory using `yarn build` before trying to run the cli again.

The commands are located in the [commands](./commands) directory and the `yargs` package that we use to run the cli will pull from there. Please see [the deploy function](./commands/deployFunction.ts) as an example on how to build commands.
