import { Platform } from 'react-native';

const getGraphQLURL = () => {
  if (__DEV__) {
    return Platform.OS === 'android' 
      ? `http://10.0.2.2:3010/api/graphql`
      : `http://inkverse.test:3010/api/graphql` 
      
  } else {
    return "https://api-v2.inkverse.co"
  }
}

const getServiceAtPort = (port: number, route: string) => {
  if (__DEV__) {
    return Platform.OS === 'ios' ? `http://inkverse.test:${port}${route}` : `http://10.0.2.2:${port}${route}`
  }else {
    return "https://inkverse.co/api" + route
  }
}

const getPostHogInfo = () => {
  if (__DEV__) {
    return {
      API_KEY: 'phc_AiS2EbRQVzTkkhTJtxedGbm8AgZHwM5yxhEcAFffD3I',
      HOST_URL: 'https://us.i.posthog.com'
    }
  } else {
    return {
      API_KEY: 'phc_AiS2EbRQVzTkkhTJtxedGbm8AgZHwM5yxhEcAFffD3I',
      HOST_URL: 'https://us.i.posthog.com'
    }
  }
}

export default {
  SERVER_URL: getGraphQLURL(),
  SERVER_AUTH_URL: getServiceAtPort(3010, '/auth'),
  SENTRY_URI: 'https://e3e6f524cc607d3415f09b5340ca4d0c@o4507607823155200.ingest.us.sentry.io/4508730854080512',
  POST_HOG_INFO: getPostHogInfo(),
};