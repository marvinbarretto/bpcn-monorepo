// apps/backend/src/admin/app.tsx

import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['en'],
  },
  bootstrap(app: StrapiApp) {
    console.log('Admin app loaded:', app);
  },
};
