const { PubSub } = require('@google-cloud/pubsub')

const topicName = 'scrape-report-images'

const main = async () => {
  const pubsub = new PubSub()

  const attributes = {
    year: '2021',
    code: 'RPQTR2'
  }

  const message = {
    attributes,
  }

  const dataBuffer = Buffer.from(JSON.stringify(message))

  const messageId = await pubsub.topic(topicName)
    .publish(dataBuffer, attributes)

  return messageId
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
