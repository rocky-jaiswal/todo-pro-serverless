import { z } from 'zod';

import { trpc, publicProcedure } from '../trpc';
import { Secrets } from '../services/secrets';

export const healthRouter = trpc.router({
  ping: publicProcedure.query(async ({ ctx }) => {
    ctx.logger.info('health check pinged ...');

    await new Secrets().getSecrets('TEST_SECRET_V2');
    // TODO: Check DynamoDB access

    return { status: 'all good!' };
  }),
  greet: publicProcedure.input(z.object({ name: z.string() })).query(({ input }: any) => {
    return `hello, ${input.name}!`;
  }),
});
