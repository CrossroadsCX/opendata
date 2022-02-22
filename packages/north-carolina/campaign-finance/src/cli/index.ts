import yargs from 'yargs'

yargs
  .commandDir('./commands')
  .demandCommand()
  .help()
  .argv
