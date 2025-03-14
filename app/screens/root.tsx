import * as React from 'react';
import { Platform, useColorScheme, ColorSchemeName, View } from 'react-native';
import { NavigationContainer, ParamListBase, RouteProp } from '@react-navigation/native';
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
import { AppLoaderProvider } from '../components/providers/AppLoaderProvider';

import { HOME_TAB, SEARCH_TAB, PROFILE_TAB, HOME_SCREEN, SEARCH_SCREEN, PROFILE_SCREEN, COMICSERIES_SCREEN, COMICISSUE_SCREEN, CREATOR_SCREEN, SETTINGS_SCREEN, LIST_SCREEN } from '../../constants/Navigation';
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
  return (
    <AppLoaderProvider>
      <NavigationContainer>
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
          <RootStack />
        </PostHogProvider>
      </NavigationContainer>
    </AppLoaderProvider>
  );
}

export default Sentry.wrap(App);