import request from 'request';
import { accessSecret } from '.';

async function slack(
  text: string
  ) {
  const webhookURL = await accessSecret('slackWebhook', 'nc-voter-data');

  if (webhookURL) {
  const result = request.post(
    {
      headers: { 'Content-type': 'application/json' },
      uri: webhookURL,
      form: { payload: JSON.stringify({ text }) }
    },
    (error: Error) => console.log(error)
  )
}};

export default slack;