const { PubSub } = require('@google-cloud/pubsub')

const topicName = 'scrape-report-images'

// const reportCodes = [
//   'CIAUL',  'COAUL',  'COCMRP', 'CTCDCF', 'CTINST', 'CTIPC',
//   'CTRAST', 'CTTHLD', 'CTTREA', 'CTCLSC', 'CTCBAS', 'CICRUU',
//   'CTDOI',  'CODN',   'CIDAL',  'CODAL',  'CIEMAL', 'COEMAL',
//   'CTFLS',  'CTIXPC', 'CTLPS',  'COMEMO', 'CIMISC', 'COMISC',
//   'CINCL',  'CONCL',  'CINOC',  'CINTAS', 'CONTAS', 'CONCRS',
//   'OT',     'CIPPAF', 'CIPA',   'COPAD',  'COPA30', 'COPA60',
//   'COPARC', 'CIPAL',  'COPAL',  'CIPRAE', 'COPRAP', 'CIPWL',
//   'COPWL',  'CIPWR',  'CTPESP', 'CORESL', 'CISPWA', 'SO',
//   'IRECR',  'IR48H',  'RPANN',  'RPCSC',  'RPECRD', 'RPMDYR',
//   'RPYRND', 'RPFIN',  'RPQTR1', 'RPQTR4', 'IRIEX',  'IRCIX',
//   'RPIER',  'RPINTM', 'IRJQY',  'RPMYSA', 'RPMNTH', 'IRMVEQ',
//   'IRNPC',  'RPORG',  'RPPGEN', 'RPPPRI', 'RPPREE', 'RPPREP',
//   'RPPRER', 'RPPREO', 'RPQTR2', 'RPSPC',  'RPSFIN', 'RP10D',
//   'RPQTR3', 'RP30D',  'RP35D',  'RP12D',  'IRVEQ',  'RPWK',
//   'RPYESA'
// ]
const reportCodes = [
  'RPQTR1',
  // 'RPQTR2',
  // 'RPQTR3',
  // 'RPQTR4',
  // 'RPMYSA',
  // 'RPYESA'
]

const years = [
  '2016',
  // '2017',
  // '2018',
  // '2019',
  // '2020',
]

const requests = []

const main = async () => {

  reportCodes.forEach((code) => {
    years.forEach((year) => {
      requests.push({
        year,
        code,
      })
    })
  })

  const pubsub = new PubSub()

  const batchPublisher = pubsub.topic(topicName, {
    batching: {
      maxMessages: 10,
      maxMilliseconds: 10000,
    }
  })

  const requestPromises = requests.map(async (req) => {
    const message = {
      attributes: req,
    }

    const dataBuffer = Buffer.from(JSON.stringify(message))

    const messageId = await batchPublisher
      .publish(dataBuffer, req)
    console.log(`Message id ${messageId} published for ${req.year}::${req.code}`)
  })

  await Promise.all(requestPromises)

  return requests
}

main()
  .then((result) => {
    console.log('Scraper finished')
    console.log(result)
    process.exit(0)
  }).catch((err) => {
    console.error(err)
    process.exit(1)
  })
