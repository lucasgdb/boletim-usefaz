import type { RequireAtLeastOne } from '@usefaz/shared';
import type { Knex } from 'knex';

import callTrxOrKnexConnection from '~/utils/callTrxOrKnexConnection';
import type { DBConnector } from '~/database/dbConnector';
import type { ILogin } from '~/interfaces';

const AuthModel = (dbConnector: DBConnector) => {
  return {
    login(user_id: string) {
      return dbConnector.knexConnection.transaction(async (trx) => {
        const login = await this.createLogin({ user_id }, trx);

        const validLogins = await trx<ILogin>('login')
          .select('id')
          .where('user_id', user_id)
          .where('active', true)
          .orderBy('created_at', 'desc')
          .limit(2);

        const validLoginIds = validLogins.map((validLogin) => validLogin.id!);

        await trx<ILogin>('login')
          .whereNotIn('id', validLoginIds)
          .andWhere('user_id', user_id)
          .andWhere('active', true)
          .update({ active: false });

        return login.id!;
      });
    },

    async logout(loginId: string) {
      const [updatedLogin] = await dbConnector
        .knexConnection<ILogin>('login')
        .update({ active: false })
        .where('id', loginId)
        .returning('*');

      return updatedLogin;
    },

    async createLogin({ user_id, active }: { user_id: string; active?: boolean }, trx?: Knex.Transaction) {
      const [newLogin] = await callTrxOrKnexConnection<ILogin>('login', dbConnector, trx)
        .insert({ user_id, active })
        .returning('*');

      return newLogin;
    },

    getLoginBy(login: RequireAtLeastOne<ILogin>) {
      return dbConnector.knexConnection<ILogin>('login').where(login).first();
    },
  };
};

export default AuthModel;
