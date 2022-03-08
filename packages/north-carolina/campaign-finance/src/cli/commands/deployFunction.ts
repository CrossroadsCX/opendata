import inquirer from 'inquirer'
import path from 'path'
import { execSync } from 'child_process'
import { Spinner } from 'cli-spinner'

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env

exports.command = 'deploy [name]'
exports.describe = 'Deploy a function'

exports.handler = async () => {
  const buildFunctions = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'buildConfirm',
      message: 'Build functions?',
      default: true,
    }
  ])

  const { buildConfirm } = buildFunctions

  if (buildConfirm) {
    console.log('Building functions...')
    execSync('yarn build')
  }

  const rootPath = execSync('npm prefix').toString().trim()

  const functions = require(path.resolve(rootPath, 'index'))
  const functionNames = Object.keys(functions)

  const answers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'functionsToDeploy',
      choices: functionNames,
    },
  ])

  const { functionsToDeploy } = answers

  functionsToDeploy.forEach((functionName: string) => {
    execSync(`gcloud functions deploy ${functionName}`, { stdio: 'inherit' })
  })
}
