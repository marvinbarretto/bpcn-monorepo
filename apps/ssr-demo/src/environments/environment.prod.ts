export const environment = {
  production: true,
  enableAllFeaturesInDevelopment: true,
  strapiUrl: process.env['NX_STRAPI_URL'],
  strapiToken: process.env['NX_STRAPI_TOKEN'],
  featureFlags: {
    homepageHero: false,
    homepageNewsWidget: false,
    homepageEventsWidget: false,
    theme: false,
    search: false,
    login: true,
    register: true,
    news: false,
    events: true,
    research: false,
    siteMap: false,
    accessibility: false,
  }
}
