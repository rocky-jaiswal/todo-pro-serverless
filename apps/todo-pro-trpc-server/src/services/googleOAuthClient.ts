import { OAuth2Client } from 'google-auth-library';
import { Secrets } from './secrets';
import { ApplicationConfiguration } from './applicationConfiguration';

export class GoogleOAuthClient {
  private readonly EMAIL_SCOPE = 'https://www.googleapis.com/auth/user.emails.read';
  private readonly GOOGLE_PEOPLE_API_V1 = 'https://people.googleapis.com/v1/people/me?personFields=emailAddresses';

  private readonly secrets: Secrets;
  private readonly config: ApplicationConfiguration;
  private oAuth2Client: OAuth2Client | null = null;

  constructor() {
    this.config = new ApplicationConfiguration();
    this.secrets = new Secrets();
  }

  private async buildOAuthClient() {
    const secrets = await Promise.all([
      this.secrets.getSecrets('GOOGLE_CLIENT_ID_V2'),
      this.secrets.getSecrets('GOOGLE_CLIENT_PASSWORD_V2'),
    ]);

    this.oAuth2Client = new OAuth2Client(secrets[0], secrets[1], this.config.getConfig('GOOGLE_REDIRECT_URI_V1'));
  }

  public async generateAuthUrl() {
    if (this.oAuth2Client === null) {
      await this.buildOAuthClient();
    }

    const authorizeUrl = this.oAuth2Client!.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', this.EMAIL_SCOPE],
    });

    return authorizeUrl;
  }

  public async getEmailFromAuthCode(code: string) {
    if (this.oAuth2Client === null) {
      await this.buildOAuthClient();
    }

    const tokenResponse = await this.oAuth2Client!.getToken(code);
    this.oAuth2Client!.setCredentials(tokenResponse.tokens);

    const res = await this.oAuth2Client!.request({
      url: this.GOOGLE_PEOPLE_API_V1,
    });

    const responseData = res.data as any;
    return { email: responseData.emailAddresses[0].value };
  }
}
