import { Storage } from '@google-cloud/storage'

// const { projectId } = process.env
const projectId = 'open-campaign-finance'

export const storage = new Storage({ projectId })
