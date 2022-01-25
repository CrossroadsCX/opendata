#!/bin/sh
##
# This is a helper utility to hold the command for publishing an example message to a pub/sub topic
##
gcloud pubsub topics publish scrape-transactions --attribute=from="01/01/2021",to="01/05/2021",type="rec"
