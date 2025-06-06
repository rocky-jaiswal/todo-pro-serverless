import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

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
        expiresIn: '1h',
      },
    );
  }

  public async validateToken(token: string) {
    return jwt.verify(token, publicKey);
  }
}
