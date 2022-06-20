import type { Knex } from 'knex';

export const up = async (knex: Knex) => {
  const hasTable = await knex.schema.hasTable('discipline');
  if (hasTable) {
    return;
  }

  await knex.schema.createTable('discipline', (table) => {
    table.increments('id').unsigned().primary();

    table.string('name').unique().notNullable();

    table.timestamps(true, true);
  });

  await knex('discipline').insert([
    { name: 'Língua Portuguesa' },
    { name: 'Matemática' },
    { name: 'Ciências' },
    { name: 'História' },
    { name: 'Geografia' },
    { name: 'Artes' },
    { name: 'Educação Física' },
    { name: 'Inglês' },
    { name: 'Informática' },
    { name: 'Filosofia e Ética' },
  ]);
};

export const down = async (knex: Knex) => {
  await knex.schema.dropTableIfExists('discipline');
};
