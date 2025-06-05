import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

type SecretKeys =
  | 'yetanotherapp-xyz/GOOGLE_CLIENT_ID_V1'
  | 'yetanotherapp-xyz/GOOGLE_CLIENT_SECRET_V1'
  | 'yetanotherapp-xyz/CERT_SECRET_V1';

export class Secrets {
  private readonly secretManagerClient: SecretsManagerClient;

  constructor() {
    this.secretManagerClient = new SecretsManagerClient({
      region: 'eu-central-1',
    });
  }

  public async getSecrets(secretKey: SecretKeys) {
    if (process.env.APP_ENVIRONMENT === 'development') {
      return process.env[secretKey];
    }

    const response = await this.secretManagerClient.send(
      new GetSecretValueCommand({
        SecretId: secretKey,
      }),
    );

    console.log(response);

    return '';
  }
}
