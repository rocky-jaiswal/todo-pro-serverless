import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const localHost = 'db'; // or 'localhost'
const TABLE_NAME = 'yetanotherapp-xyz-data-table';
const TEST_TABLE_NAME = 'yetanotherapp-xyz-data-test-table';

const localDBClient = new DynamoDBClient({
  region: localHost,
  endpoint: `http://${localHost}:8000`,
  credentials: {
    accessKeyId: 'sao9c6', // Can be anything for local
    secretAccessKey: 'ixxi48',
  },
});

const localDocumentClient = new DynamoDB.DocumentClient({
  region: localHost,
  endpoint: `http://${localHost}:8000`,
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
  if (['development', 'test'].includes(process.env.NODE_ENV ?? '') || process.env.APP_ENVIRONMENT === 'development') {
    return { dbClient: localDBClient, documentClient: localDocumentClient };
  }

  return { dbClient: prodDBClient, documentClient: prodDocumentClient };
};

export const getTableName = () => {
  if (process.env.NODE_ENV === 'test') {
    return TEST_TABLE_NAME;
  }
  return TABLE_NAME;
};
