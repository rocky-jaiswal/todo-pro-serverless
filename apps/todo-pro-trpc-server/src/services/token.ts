import fs from 'fs';
import path from 'path';
import jwt, { type JwtPayload } from 'jsonwebtoken';

const privateKeyPath = path.resolve(__dirname, `./../keys/private.pem`);
const privateKey = fs.readFileSync(privateKeyPath);

const publicKeyPath = path.resolve(__dirname, `./../keys/public.pub`);
const publicKey = fs.readFileSync(publicKeyPath);

export class JWToken {
  public async createToken(userId: string, passphrase: string, keyid: string) {
    return jwt.sign(
      { sub: userId },
      { key: privateKey, passphrase },
      {
        keyid,
        algorithm: 'RS256',
        audience: 'access',
        expiresIn: '8h',
      },
    );
  }

  public async validateToken(token: string) {
    const payload = jwt.verify(token, publicKey);
    return payload as JwtPayload;
  }
}
