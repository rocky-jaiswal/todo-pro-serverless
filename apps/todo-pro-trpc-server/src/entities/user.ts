import { Entity } from 'electrodb';
import { getClient, TABLE_NAME } from './client';

export const User = new Entity(
  {
    model: {
      entity: 'user',
      version: '1',
      service: 'taskmanager',
    },
    attributes: {
      userId: { type: 'string', required: true },
      entityType: { type: 'string', readOnly: true, default: 'user' },
      email: { type: 'string' },
      loginType: { type: 'string' },
      password: { type: 'string' },
      createdOn: { type: 'string', required: true },
    },
    indexes: {
      user: {
        pk: {
          field: 'pk',
          composite: ['userId'],
          template: 'USER#${userId}',
        },
        sk: {
          field: 'sk',
          composite: ['userId'],
          template: 'USER#${userId}',
        },
      },
    },
  },
  { table: TABLE_NAME, client: getClient().documentClient },
);
