import { z } from 'zod';

import { trpc, publicProcedure } from '../trpc';
import { Secrets } from '../services/secrets';

export const healthRouter = trpc.router({
  ping: publicProcedure.query(async ({ ctx }) => {
    ctx.logger.info('health check pinged ...');

    const secrets = new Secrets();
    await secrets.getSecrets('GOOGLE_CLIENT_ID_V1');

    return { status: 'all good!' };
  }),
  greet: publicProcedure.input(z.object({ name: z.string() })).query(({ input }: any) => {
    return `hello, ${input.name}!`;
  }),
});
