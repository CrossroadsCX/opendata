import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

export default async (
    secretName: string,
    projectName: string) => {
  // [START secretmanager_access_secret_version]
  const name = `projects/${projectName}/secrets/${secretName}/versions/latest`;

  // Instantiates a client
  const client = new SecretManagerServiceClient();

  async function accessSecret() {
    const [version] = await client.accessSecretVersion({
      name,
    });

    // Extract the payload as a string.
    if (version.payload && version.payload.data) { 
    const payload: string = version.payload.data.toString();
    return payload;
    } else {
        return "Slack Webhook URL not found";
    }
  }
  return accessSecret();
};