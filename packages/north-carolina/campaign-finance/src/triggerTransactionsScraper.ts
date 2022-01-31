import { PubSub } from '@google-cloud/pubsub'
import { logger } from './logger'

const topicName = 'scrape-transactions'

const requests = [
  {
    from: '01/01/2021',
    to: '01/31/2021',
    type: 'rec'
  },
  {
    from: '01/01/2021',
    to: '01/30/2021',
    type: 'exp'
  },
  {
    from: '02/01/2021',
    to: '02/28/2021',
    type: 'rec'
  },
  {
    from: '02/01/2021',
    to: '02/28/2021',
    type: 'exp'
  },
]

export const triggerTransactionsScraper = () => {
  try {
    const pubsub = new PubSub()

    const batchPublisher = pubsub.topic(topicName, {
      batching: {
        maxMessages: 10,
        maxMilliseconds: 10000,
      }
    })

    requests.forEach(async (request) => {
      const messageId = await batchPublisher.publish(Buffer.from(''), request)
      logger.info(`Message id ${messageId} published.`)
    })
  } catch (err) {
    logger.error(err)
    throw err
  }
}
