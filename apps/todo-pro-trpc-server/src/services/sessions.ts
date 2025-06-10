import { Secrets } from './secrets';
import { JWToken } from './token';

export class SessionsService {
  private readonly secrets: Secrets;
  private readonly token: JWToken;

  constructor() {
    this.secrets = new Secrets();
    this.token = new JWToken();
  }

  public async createSession(userId: string) {
    const passphrase = await this.secrets.getSecrets('CERT_SECRET_V1');
    const keyId = await this.secrets.getSecrets('KEY_ID_V1');

    const jwt = this.token.createToken(userId, passphrase!, keyId!);

    return jwt;
  }
}
