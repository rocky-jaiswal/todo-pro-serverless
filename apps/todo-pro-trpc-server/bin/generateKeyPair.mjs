'use strict'

import { writeFileSync, readFileSync } from 'fs'
import { randomBytes, generateKeyPairSync } from 'crypto'
import { pem2jwk } from 'pem-jwk'
import { v4 as uuidv4 } from 'uuid'

const generateJwks = (publicKeyPath) => {
  const jkwsBase = pem2jwk(readFileSync(publicKeyPath))
  const jwksEntry = Object.assign(
    {
      alg: 'RS256',
      use: 'sig',
      kid: uuidv4(),
    },
    jkwsBase
  )
  console.log(
    `Please not the key id`
  )
  console.log('-----------------------------')
  console.log(JSON.stringify(jwksEntry))
  console.log('-----------------------------')
}

const generateKeyPair = () => {
  const password = randomBytes(256).toString('hex').substring(0, 32)

  console.log(`Generating key ...`)
  console.log(
    'Password below, please copy it and add it to secrets (as per the environment) manually:'
  )
  console.log('-----------------------------')
  console.log(password)
  console.log('-----------------------------')

  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
      cipher: 'aes-256-cbc',
      passphrase: password,
    },
  })

  const publicKeyPath = `./src/keys/public.pub`
  const privateKeyPath = `./src/keys/private.pem`

  console.log(`Writing to - ${publicKeyPath}`)
  console.log(`Writing to - ${privateKeyPath}`)

  writeFileSync(publicKeyPath, publicKey)
  writeFileSync(privateKeyPath, privateKey)

  generateJwks(publicKeyPath)
}

generateKeyPair()
