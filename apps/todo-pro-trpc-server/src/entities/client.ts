import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const localDBClient = new DynamoDBClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'sao9c6', // Can be anything for local
    secretAccessKey: 'ixxi48',
  },
});

const localDocumentClient = new DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  credentials: {
    accessKeyId: 'sao9c6', // Can be anything for local
    secretAccessKey: 'ixxi48',
  },
});

const prodDBClient = new DynamoDBClient({
  region: 'eu-central-1',
});

const prodDocumentClient = new DynamoDB.DocumentClient({
  region: 'eu-central-1',
});

export const getClient = () => {
  if (process.env.NODE_ENV === 'developement' || process.env.APP_ENVIRONMENT === 'development') {
    return { dbClient: localDBClient, documentClient: localDocumentClient };
  }

  return { dbClient: prodDBClient, documentClient: prodDocumentClient };
};

export const TABLE_NAME = 'yetanotherapp-xyz-data-table';
