export const HOME_TAB = "HomeTab";
export const SEARCH_TAB = "SearchTab";
export const PROFILE_TAB = "ProfileTab";
export const HOME_SCREEN = "HomeScreen";
export const SEARCH_SCREEN = "SearchScreen";
export const PROFILE_SCREEN = "ProfileScreen";
export const COMICSERIES_SCREEN = "ComicSeriesScreen";
export const READER_SCREEN = "ReaderScreen";
export const CREATOR_SCREEN = "CreatorScreen";

import { ComicSeriesScreenParams } from "@/app/screens/comicseries";

export type RootStackParamList = {
  [HOME_TAB]: undefined;
  [SEARCH_TAB]: undefined;
  [PROFILE_TAB]: undefined;
  [HOME_SCREEN]: undefined;
  [COMICSERIES_SCREEN]: ComicSeriesScreenParams;
  [SEARCH_SCREEN]: undefined;
  [PROFILE_SCREEN]: undefined;
  [READER_SCREEN]: undefined;
  [CREATOR_SCREEN]: { uuid: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 