# google-cloud

## Setup google cloud cli:
Run on any local machine directory:
  gcloud iam service-accounts keys create dev-testing.json --iam-account=dev-testing@open-campaign-finance.iam.gserviceaccount.com

Run to set the enviroment variable
  export GOOGLE_APPLICATION_CREDENTIALS="~/path-to/dev-testing.json"

Go to google-cloud folder 
  cd packages/googlecloud

Run
  yarn build

Run
  yarn dlx @google-cloud/functions-framework --target=scrapTransaction

Browse/curl to:
  http://localhost:8080/?from=dd/mm/yyyy&to=dd/mm/yyyy


