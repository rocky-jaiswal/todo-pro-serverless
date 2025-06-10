import { Entity } from 'electrodb';
import { getClient } from './client';

const TABLE_NAME = 'yetanotherapp-xyz-data-table';

export const TaskList = new Entity(
  {
    model: {
      entity: 'taskList',
      version: '1',
      service: 'taskmanager',
    },
    attributes: {
      userId: { type: 'string', required: true },
      entityType: { type: 'string', readOnly: true, default: 'taskList' },
      listId: { type: 'string', required: true },
      listTitle: { type: 'string', required: true },
      listDescription: { type: 'string' },
      createdOn: { type: 'string', required: true },
    },
    indexes: {
      taskList: {
        pk: {
          field: 'pk',
          composite: ['userId'],
          template: 'USER#${userId}',
        },
        sk: {
          field: 'sk',
          composite: ['listId'],
          template: 'LIST#${listId}',
        },
      },
    },
  },
  { table: TABLE_NAME, client: getClient().documentClient },
);
