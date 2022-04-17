import type { Context } from 'koa';

import usefazConnector from '~/database/usefazConnector';

export const checkHealth = async (ctx: Context) => {
  const hasConnection = await usefazConnector.checkConnection();
  if (hasConnection) {
    ctx.status = 200;
    ctx.body = 'OK';

    return;
  }

  ctx.status = 503;
  ctx.body = 'DB out of service!';
};
