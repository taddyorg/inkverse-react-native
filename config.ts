import { Platform } from 'react-native';

const developmentConfig = {
  "SERVER_URL": getGraphQLURL(false),
  "SENTRY_URL": "https://09be2495177f48c48f6161ad3b37949a@o4504175906455553.ingest.sentry.io/4504175947612160",
  "POST_HOG_INFO": {
    API_KEY: 'phc_AiS2EbRQVzTkkhTJtxedGbm8AgZHwM5yxhEcAFffD3I',
    HOST_URL: 'https://us.i.posthog.com'
  },
}

const developmentConfigButProductionData = {
  "SERVER_URL": getGraphQLURL(true),
  "SENTRY_URL": "https://09be2495177f48c48f6161ad3b37949a@o4504175906455553.ingest.sentry.io/4504175947612160",
  "POST_HOG_INFO": {
    API_KEY: 'phc_AiS2EbRQVzTkkhTJtxedGbm8AgZHwM5yxhEcAFffD3I',
    HOST_URL: 'https://us.i.posthog.com'
  },
}

const productionConfig = {
  "SERVER_URL": getGraphQLURL(true),
  "SENTRY_URL": "https://c295077d608f4d67835c2391ee0a688d@o4504175906455553.ingest.sentry.io/4504175951544320",
  "POST_HOG_INFO": {
    API_KEY: 'phc_AiS2EbRQVzTkkhTJtxedGbm8AgZHwM5yxhEcAFffD3I',
    HOST_URL: 'https://us.i.posthog.com'
  },
}

function getGraphQLURL(isProduction: boolean) {
  if (!isProduction) {
    return Platform.OS === 'android' 
      ? `http://10.0.2.2:3010/api/graphql`
      : `http://inkverse.test:3010/api/graphql` 
  } else {
    return "https://api-preview.inkverse.co/api/graphql"
  }
}

export default __DEV__
  ? developmentConfig
  : productionConfig