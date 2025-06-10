import { Entity } from 'electrodb';
import { getClient } from './client';

const TABLE_NAME = 'yetanotherapp-xyz-data-table';

export const Task = new Entity(
  {
    model: {
      entity: 'task',
      version: '1',
      service: 'taskmanager',
    },
    attributes: {
      userId: { type: 'string', required: true },
      entityType: { type: 'string', readOnly: true, default: 'task' },
      listId: { type: 'string', required: true },
      taskId: { type: 'string', required: true },
      taskTitle: { type: 'string', required: true },
      taskDueBy: { type: 'string' },
      taskCompleted: { type: 'boolean' },
      createdOn: { type: 'string', required: true },
    },
    indexes: {
      task: {
        pk: {
          field: 'pk',
          composite: ['userId'],
          template: 'USER#${userId}',
        },
        sk: {
          field: 'sk',
          composite: ['listId', 'taskId'],
          template: 'LIST#${listId}#TASK#${taskId}',
        },
      },
    },
  },
  { table: TABLE_NAME, client: getClient().documentClient },
);
