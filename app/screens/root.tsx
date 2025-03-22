import * as React from 'react';
import { Platform, useColorScheme, ColorSchemeName } from 'react-native';
import { NavigationContainer, ParamListBase, RouteProp, LinkingOptions, getStateFromPath } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import { PostHogProvider } from 'posthog-react-native'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import config from '@/config';
import { HomeScreen } from './home';
import { SearchScreen } from './search'
import { ProfileScreen } from './profile';
import { ComicSeriesScreen } from './comicseries';
import { ComicIssueScreen } from './comicissue';
import { CreatorScreen } from './creator';
import { SettingsScreen } from './settings';
import { ListScreen } from './list';
import { ComicsListScreen } from './comicslist';
import { BlogScreen } from './blog';
import { ReportsScreen } from './reports';
import { AppLoaderProvider } from '../components/providers/AppLoaderProvider';

import { HOME_TAB, SEARCH_TAB, PROFILE_TAB, HOME_SCREEN, SEARCH_SCREEN, PROFILE_SCREEN, COMICSERIES_SCREEN, COMICISSUE_SCREEN, CREATOR_SCREEN, SETTINGS_SCREEN, LIST_SCREEN, COMICS_LIST_SCREEN, BLOG_SCREEN, REPORTS_SCREEN, MAIN_SCREEN } from '../../constants/Navigation';
import { Colors } from '../../constants/Colors';

Sentry.init({
  dsn: config.SENTRY_URI,
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const comicSeriesScreenConfig = {
  name: COMICSERIES_SCREEN,
  component: ComicSeriesScreen,
  options: {
    title: '',
    headerShown: false,
  }
};

const comicIssueScreenConfig = {
  name: COMICISSUE_SCREEN,
  component: ComicIssueScreen,
  options: {
    title: '',
    headerShown: false,
  }
};

const creatorScreenConfig = {
  name: CREATOR_SCREEN,
  component: CreatorScreen,
  options: {
    title: '',
    headerShown: false,
  }
};

const settingsScreenConfig = {
  name: SETTINGS_SCREEN,
  component: SettingsScreen,
  options: {
    title: '',
    headerShown: false,
  }
};

const listScreenConfig = {
  name: LIST_SCREEN,
  component: ListScreen,
  options: {
    title: '',
    headerShown: false,
  }
};

const comicsListScreenConfig = {
  name: COMICS_LIST_SCREEN,
  component: ComicsListScreen,
  options: {
    title: '',
    headerShown: false,
  }
};

const stackScreenOptions = {
  ...Platform.select({
    android: {
      animation: 'slide_from_right' as const,
      presentation: 'transparentModal' as const,
    },
  }),
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen 
        name={HOME_SCREEN} 
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false
        }}
      />
      <Stack.Screen {...comicSeriesScreenConfig} />
      <Stack.Screen {...comicIssueScreenConfig} />
      <Stack.Screen {...creatorScreenConfig} />
      <Stack.Screen {...listScreenConfig} />
      <Stack.Screen {...comicsListScreenConfig} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen 
        name={SEARCH_SCREEN} 
        component={SearchScreen}
        options={{
          title: 'Search',
          headerShown: false
        }}
      />
      <Stack.Screen {...comicSeriesScreenConfig} />
      <Stack.Screen {...comicIssueScreenConfig} />
      <Stack.Screen {...creatorScreenConfig} />
      <Stack.Screen {...listScreenConfig} />
      <Stack.Screen {...comicsListScreenConfig} />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen 
        name={PROFILE_SCREEN} 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: false
        }}
      />
      <Stack.Screen {...comicSeriesScreenConfig} />
      <Stack.Screen {...comicIssueScreenConfig} />
      <Stack.Screen {...creatorScreenConfig} />
      <Stack.Screen {...settingsScreenConfig} />
      <Stack.Screen {...listScreenConfig} />
    </Stack.Navigator>
  );
}

const tabBarStyleOptions = (colorScheme: ColorSchemeName) => {
  const navBackground = Colors[colorScheme ?? 'light'].background;
  const tabBarActiveTintColor = Colors[colorScheme ?? 'light'].text;

  return ({ route }: { route: RouteProp<ParamListBase, string> }) => {
    const isComicIssueScreen = getFocusedRouteNameFromRoute(route) === COMICISSUE_SCREEN;
    const tabBarStyleDisplay = isComicIssueScreen 
      ? { display: 'none' as const }
      : { display: 'flex' as const };
    
    return {
      headerShown: false,
      tabBarStyle: {
        backgroundColor: navBackground,
        borderTopWidth: 0,
        ...tabBarStyleDisplay,
        tabBarVisibilityAnimationConfig: {
          animation: 'slide_from_bottom'
        }
      },
      tabBarActiveTintColor,
      ...Platform.select({
        ios: {
          tabBarLabelStyle: {
            fontSize: 11
          },
          tabBarIconStyle: {
            marginTop: 5,
            marginBottom: 3
          }
        },
      })
    };
  };
};

const iconSize = 22;

function getIconName(name: string) {
  switch (name) {
      case HOME_TAB:
          return "home";
      case SEARCH_TAB:
          return "search";
      case PROFILE_TAB:
          return "user-alt";
      default:
          throw new Error("Invalid tab name");
  }
}

function RootStack() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator 
      initialRouteName={HOME_TAB}
      screenOptions={tabBarStyleOptions(colorScheme)}
    >
      <Tab.Screen 
        name={HOME_TAB} 
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
              <FontAwesome5 name={getIconName(HOME_TAB)} size={iconSize} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name={SEARCH_TAB} 
        component={SearchStack}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name={getIconName(SEARCH_TAB)} size={iconSize} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name={PROFILE_TAB} 
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name={getIconName(PROFILE_TAB)} size={iconSize} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function App() {
  const linking: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: ['https://inkverse.co'],
    config: {
      initialRouteName: MAIN_SCREEN,
      screens: {
        [MAIN_SCREEN]: {
          screens: {
            [HOME_TAB]: {
              screens: {
                [HOME_SCREEN]: '',
                [COMICSERIES_SCREEN]: 'comics/:shortUrl',
                [COMICISSUE_SCREEN]: 'comics/:shortUrl/:uuid-and-name',
                [CREATOR_SCREEN]: 'creators/:shortUrl',
                [LIST_SCREEN]: 'lists/:id',
              }
            },
            [SEARCH_TAB]: {
              screens: {
                [SEARCH_SCREEN]: 'search',
                [COMICSERIES_SCREEN]: 'comics/:shortUrl',
                [COMICISSUE_SCREEN]: 'comics/:shortUrl/:uuid-and-name',
                [CREATOR_SCREEN]: 'creators/:shortUrl',
                [LIST_SCREEN]: 'lists/:id',
              }
            },
            [PROFILE_TAB]: {
              screens: {
                [PROFILE_SCREEN]: 'profile',
                [COMICSERIES_SCREEN]: 'comics/:shortUrl',
                [COMICISSUE_SCREEN]: 'comics/:shortUrl/:uuid-and-name',
                [CREATOR_SCREEN]: 'creators/:shortUrl',
                [LIST_SCREEN]: 'lists/:id',
              }
            },
          }
        },
        [BLOG_SCREEN]: 'blog/:slug',
      },
    },
    // Custom function to handle URLs that the built-in parser cannot handle
    getStateFromPath: (path, options) => {
      // Use the default parser first
      const state = getStateFromPath(path, options);
      
      // If the default parser worked, return its result
      if (state) return state;
      
      // Handle any custom URL formats here if needed
      return undefined;
    },
  };

  const modalScreenOptions = {
    presentation: 'modal' as const,
    animation: 'slide_from_bottom' as const,
    gestureEnabled: true,
    gestureDirection: 'vertical' as const,
    fullScreenGestureEnabled: true,
    contentStyle: { backgroundColor: 'white' },
  }

  return (
    <AppLoaderProvider>
      <NavigationContainer linking={linking}>
        <PostHogProvider 
          apiKey={config.POST_HOG_INFO.API_KEY}
          options={{
            host: config.POST_HOG_INFO.HOST_URL,
            // enableSessionReplay: true,
            // sessionReplayConfig: {
            //   maskAllTextInputs: true,
            //   maskAllImages: true,
            //   captureLog: true,
            //   captureNetworkTelemetry: true,
            //   androidDebouncerDelayMs: 500,
            //   iOSdebouncerDelayMs: 1000,
            // },
          }}
        >
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={MAIN_SCREEN} component={RootStack} />
            <Stack.Screen 
              name={BLOG_SCREEN} 
              component={BlogScreen}
              options={modalScreenOptions}
            />
            <Stack.Screen 
              name={REPORTS_SCREEN} 
              component={ReportsScreen}
              options={modalScreenOptions}
            />
          </Stack.Navigator>
        </PostHogProvider>
      </NavigationContainer>
    </AppLoaderProvider>
  );
}

export default Sentry.wrap(App);