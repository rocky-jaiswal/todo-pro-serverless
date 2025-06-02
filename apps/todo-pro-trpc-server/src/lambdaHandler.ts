import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';

import { createContext } from './trpc';
import { router } from './routers';

export const handler = awsLambdaRequestHandler({
  router,
  createContext,
});
