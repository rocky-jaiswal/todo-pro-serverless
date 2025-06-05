import { trpc, protectedProcedure } from '../trpc';

export const homeRouter = trpc.router({
  findUserAndLists: protectedProcedure.query(async ({ ctx }) => {
    ctx.logger.info('--->');
    return {};
  }),
});
