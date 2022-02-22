import inquirer from 'inquirer'
import path from 'path'
import { execSync } from 'child_process'
import { Spinner } from 'cli-spinner'

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env

exports.command = 'deploy [name]'
exports.describe = 'Deploy a function'

exports.handler = async () => {

  console.log('Building functions...')
  execSync('yarn build').toString()

  const rootPath = execSync('npm prefix').toString().trim()

  const functions = require(path.resolve(rootPath, 'index'))
  const functionNames = Object.keys(functions)

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'functionName',
      choices: functionNames,
    },
  ])

  const { functionName } = answers

  execSync(`gcloud functions deploy ${functionName}`, { stdio: 'inherit' })
}
