export const HOME_TAB = "HomeTab";
export const SEARCH_TAB = "SearchTab";
export const PROFILE_TAB = "ProfileTab";
export const HOME_SCREEN = "HomeScreen";
export const SEARCH_SCREEN = "SearchScreen";
export const PROFILE_SCREEN = "ProfileScreen";
export const COMICSERIES_SCREEN = "ComicSeriesScreen";
export const COMICISSUE_SCREEN = "ComicIssueScreen";
export const CREATOR_SCREEN = "CreatorScreen";
export const SETTINGS_SCREEN = "SettingsScreen";
export const LIST_SCREEN = "ListScreen";

import { ComicSeriesScreenParams } from "@/app/screens/comicseries";
import { ComicIssueScreenParams } from "@/app/screens/comicissue";
import { CreatorScreenParams } from "@/app/screens/creator";
import { SettingsScreenParams } from "@/app/screens/settings";
import { ListScreenParams } from "@/app/screens/list";

export type RootStackParamList = {
  [HOME_TAB]: undefined;
  [SEARCH_TAB]: undefined;
  [PROFILE_TAB]: undefined;
  [HOME_SCREEN]: undefined;
  [COMICSERIES_SCREEN]: ComicSeriesScreenParams;
  [COMICISSUE_SCREEN]: ComicIssueScreenParams;
  [CREATOR_SCREEN]: CreatorScreenParams;
  [SEARCH_SCREEN]: undefined;
  [PROFILE_SCREEN]: undefined;
  [SETTINGS_SCREEN]: SettingsScreenParams;
  [LIST_SCREEN]: ListScreenParams;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 