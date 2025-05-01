export const environment = {
  production: false,
  enableAllFeaturesInDevelopment: true,
  strapiUrl: 'STRAPI_URL',
  strapiToken: 'STRAPI_TOKEN',
  featureFlags: {
    homepageHero: false,
    homepageNewsWidget: false,
    homepageEventsWidget: false,
    login: true,
    register: true,
    news: false,
    events: true,
    research: false,
    siteMap: false,
    accessibility: false
  }
}
