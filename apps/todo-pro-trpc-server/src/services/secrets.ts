import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

type SecretKeys = 'GOOGLE_CLIENT_ID_V1' | 'GOOGLE_CLIENT_SECRET_V1' | 'CERT_SECRET_V1' | 'KEY_ID_V1' | 'TEST_SECRET_V2';

const AWS_NAMESPACE = 'yetanotherapp-xyz';

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
        SecretId: `${AWS_NAMESPACE}/${secretKey}`,
      }),
    );

    console.log(response);

    return '';
  }
}
