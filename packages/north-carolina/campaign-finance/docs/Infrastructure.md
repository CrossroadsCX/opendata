# Campaign Finance Infrastructure

Before reading through any of the following infrastructure setup please install the [gcloud cli tool](https://cloud.google.com/sdk/docs/install).

## GCloud Setup

Make sure to set the following configuration variables before continuing:

`gcloud config set project <project-id>`

## Pub/Sub Topics

Run the following gcloud commands to set up the pub/sub topics for this project:

`gcloud pubsub topics create scrape-transactions`

`gcloud pubsub topics create staged-transactions`

## Storage Buckets

You'll need to create your own bucket names, as bucket names are global in GCP infrastructure, but we've listed our bucket names for reference

`gsutil mb gs://raw-transactions`
`gsutil mb gs://staged-transactions`
`gsutil mb gs://campaign-finance-snowpipe` - Optional, used for Snowflake ingestion

## Cloud Functions

_coming soon_
