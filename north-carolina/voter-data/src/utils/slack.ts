const request = require('request');

const webhookURL = 'https://hooks.slack.com/services/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';

function slack() {

const text = 'new NC voterfile written';
request.post(
  {
    headers : { 'Content-type' : 'application/json' },
    uri: webhookURL,
    form : {payload: JSON.stringify({ text } )}
  },
  (error: any, res: any, body: any) => console.log(error)
)};

export default slack;