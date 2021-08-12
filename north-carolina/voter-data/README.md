# NCSBE Scapers

downloadToBucket function allows a zip file at a targetURL to be streamed to a GCP bucket without having written the file locally. If a file being uploaded already exists, it will replace the existing file.

downloadToBucket function requires that you have a service account key which can be created [here](https://console.cloud.google.com/iam-admin/serviceaccounts?_ga=2.74694161.2079531087.1628653933-1776153213.1611682986&project=nc-voter-data&folder=&organizationId=&supportedpurview=project) in order to write to a storage bucket. instructions are [here](https://cloud.google.com/iam/docs/creating-managing-service-account-keys). The key should be placed in the top level directory, and should be ignored already by gitignore.
