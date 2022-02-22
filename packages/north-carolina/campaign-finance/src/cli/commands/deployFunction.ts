import inquirer from 'inquirer'
import path from 'path'
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'
import { minutesToHours } from 'date-fns'

const exec = promisify(execCallback)
const { GOOGLE_APPLICATION_CREDENTIALS } = process.env

exports.command = 'deploy [name]'
exports.describe = 'Deploy a function'

exports.handler = async () => {

  console.log('Building functions...')
  const { stdout: buildLogs } = await exec('yarn build')
  console.log(buildLogs)

  const { stdout, stderr } = await exec('npm prefix')

  const rootPath = stdout.trim()
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

  console.log(`Deploying ${functionName}. This may take up to 2 minutes...`)
  const { stdout: deployLog, stderr: deployErr } = await exec(`gcloud functions deploy ${functionName}`)

  console.log(deployLog)
  console.log(deployErr)
}
