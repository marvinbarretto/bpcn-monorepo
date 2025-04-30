export default [
  {
    name: 'strapi::logger',
    config: {
      level: 'debug'
    },
  },
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'http:'],
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      origin: '*',
      credentials: true,
    },
  },  
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
