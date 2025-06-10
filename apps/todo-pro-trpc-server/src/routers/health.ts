import { z } from 'zod';
import { DescribeTableCommand } from '@aws-sdk/client-dynamodb';

import { trpc, publicProcedure } from '../trpc';
import { Secrets } from '../services/secrets';
import { getClient, TABLE_NAME } from '../entities/client';

export const healthRouter = trpc.router({
  ping: publicProcedure.query(async ({ ctx }) => {
    ctx.logger.info('health check pinged ...');

    await new Secrets().getSecrets('TEST_SECRET_V2');

    const command = new DescribeTableCommand({
      TableName: TABLE_NAME,
    });

    const tables = await getClient().dbClient.send(command);
    if (!tables.Table) {
      throw new Error('Error connecting to DynamoDB');
    }

    return { status: 'all good!' };
  }),
  greet: publicProcedure.input(z.object({ name: z.string() })).query(({ input }: any) => {
    return `hello, ${input.name}!`;
  }),
});
