import { createHash, randomBytes } from 'crypto';

export class CryptoUtils {
  public generateRandomString(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  public generateCodeChallenge(verifier: string): string {
    return createHash('sha256').update(verifier).digest('base64url');
  }

  public hashSessionId(sessionId: string): string {
    return createHash('sha256')
      .update(sessionId + process.env.SESSION_SECRET)
      .digest('hex');
  }
}
