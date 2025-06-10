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

export const getClient = () => {
  if (process.env.NODE_ENV === 'developement') {
    return { dbClient: localDBClient, documentClient: localDocumentClient };
  }

  return { dbClient: localDBClient, documentClient: localDocumentClient };
};

export const TABLE_NAME = 'yetanotherapp-xyz-data-table';
