import * as React from 'react';
import { Platform, useColorScheme, ColorSchemeName } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Sentry from '@sentry/react-native';
import { PostHogProvider } from 'posthog-react-native'

import config from '@/config';
import { HomeScreen } from './home';
import { SearchScreen } from './search'
import { ProfileScreen } from './profile';

import { HOME_TAB, SEARCH_TAB, PROFILE_TAB, HOME_SCREEN, SEARCH_SCREEN, PROFILE_SCREEN } from '../../constants/Navigation';
import { Colors } from '../../constants/Colors';

Sentry.init({
  dsn: config.SENTRY_URI,
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={HOME_SCREEN} 
        component={HomeScreen}
        options={{
          title: 'Home',
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={SEARCH_SCREEN} 
        component={SearchScreen}
        options={{
          title: 'Search',
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={PROFILE_SCREEN} 
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
}

const tabBarOptions = (colorScheme: ColorSchemeName) => {
  const navBackground = Colors[colorScheme ?? 'light'].background;
  const tabBarActiveTintColor = Colors[colorScheme ?? 'light'].text;

  return {
    headerShown: false,
    tabBarStyle: {
      backgroundColor: navBackground,
      borderTopWidth: 0,
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
      }
    })
  }
}

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
      screenOptions={tabBarOptions(colorScheme)}
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
    <NavigationContainer>
      <PostHogProvider 
        apiKey={config.POST_HOG_INFO.API_KEY}
        options={{
          host: config.POST_HOG_INFO.HOST_URL,
          enableSessionReplay: true,
          sessionReplayConfig: {
            maskAllTextInputs: true,
            maskAllImages: true,
            captureLog: true,
            captureNetworkTelemetry: true,
            androidDebouncerDelayMs: 500,
            iOSdebouncerDelayMs: 1000,
          },
        }}
      >
        <RootStack />
      </PostHogProvider>
    </NavigationContainer>
  );
}

export default Sentry.wrap(App);