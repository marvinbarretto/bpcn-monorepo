// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    const anyExistingUsers = await strapi.query('plugin::users-permissions.user').findMany();
    if (anyExistingUsers.length > 0) return;

    const roles = await strapi.query('plugin::users-permissions.role').findMany();
    const roleMap = Object.fromEntries(roles.map(role => [role.name, role]));

    const usersToCreate = [
      {
        username: 'public',
        email: 'public@test.com',
        password: '123',
        role: roleMap['Public'],
      },
      {
        username: 'auth',
        email: 'auth@test.com',
        password: '123',
        role: roleMap['Authenticated'],
      },
      {
        username: 'author',
        email: 'author@test.com',
        password: '123',
        role: roleMap['Author'],
      },
      {
        username: 'admin',
        email: 'admin@test.com',
        password: '123',
        role: roleMap['Admin'],
      },
    ];

    for (const user of usersToCreate) {
      await strapi.query('plugin::users-permissions.user').create({ data: user });
    }

    console.log('*** Users seeded');
  },
};
