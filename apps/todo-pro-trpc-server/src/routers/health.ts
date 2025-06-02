import { z } from 'zod';

import { trpc, publicProcedure } from '../trpc';

export const healthRouter = trpc.router({
  ping: publicProcedure.query(() => {
    return { status: 'all good!' };
  }),
  greet: publicProcedure.input(z.object({ name: z.string() })).query(({ input }: any) => {
    return `hello, ${input.name}!`;
  }),
});
