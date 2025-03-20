import { useReducer, useState, useCallback, useEffect, memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import { Screen, HeaderBackButton, HeaderShareButton, ThemedActivityIndicator, ThemedRefreshControl } from '@/app/components/ui';
import { ComicSeriesDetails, ComicSeriesPageType } from '@/app/components/comics/ComicSeriesDetails';
import { ComicIssuesList, ComicIssuesListProps } from '@/app/components/comics/ComicIssuesList';

import { publicClient } from '@/lib/apollo';
import { ComicSeries } from '@/shared/graphql/types';
import { loadComicSeries, comicSeriesQueryReducerDefault, comicSeriesInitialState } from '@/shared/dispatch/comicseries';
import { RootStackParamList, COMICSERIES_SCREEN } from '@/constants/Navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export interface ComicSeriesScreenParams {
  uuid: string;
};

type ListItem = 
  | { type: 'header'; data: ComicSeries }
  | { type: 'issues'; data: ComicIssuesListProps };

export function ComicSeriesScreen() {
  const route = useRoute<NativeStackScreenProps<RootStackParamList, typeof COMICSERIES_SCREEN>['route']>();
  const { uuid } = route.params;
  
  const [comicSeriesState, dispatch] = useReducer(comicSeriesQueryReducerDefault, comicSeriesInitialState);
  const [refreshing, setRefreshing] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const { isComicSeriesLoading, comicseries, issues } = comicSeriesState;

  useEffect(() => {
    loadComicSeries({ publicClient, uuid }, dispatch);
  }, [uuid]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadComicSeries({ publicClient, uuid, forceRefresh: true }, dispatch);
    setRefreshing(false);
  }, [uuid]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    switch (item.type) {
      case 'header':
        return (
          <ComicSeriesDetails
            comicseries={item.data}
            firstIssue={issues[0]}
            pageType={ComicSeriesPageType.COMICSERIES_SCREEN}
            isHeaderVisible={isHeaderVisible}
            onHeaderVisibilityChange={setIsHeaderVisible}
          />
        );
      case 'issues':
        return (
          <ComicIssuesList 
            comicissues={item.data.comicissues} 
            comicseries={item.data.comicseries} 
            currentIssueUuid={item.data.comicissues?.[0]?.uuid}
          />
        );
      default:
        return null;
    }
  }, [comicseries, issues, isHeaderVisible, setIsHeaderVisible]);

  const keyExtractor = useCallback((item: ListItem) => {
    return item.type === 'header' 
      ? `header-${item.data.uuid}` 
      : `issues-${item.data.comicseries.uuid}`;
  }, []);

  const getListData = useCallback((): ListItem[] => {
    if (!comicseries) return [];
    return [
      { type: 'header', data: comicseries },
      { type: 'issues', data: { comicissues: issues, comicseries, currentIssueUuid: issues[0]?.uuid } },
    ];
  }, [comicseries, issues]);

  if (isComicSeriesLoading) {
    return (
      <ComicSeriesScreenWrapper isHeaderVisible={isHeaderVisible} comicseries={comicseries}>
        <View style={styles.loadingContainer}>
          <ThemedActivityIndicator />
        </View>
      </ComicSeriesScreenWrapper>
    );
  }

  return (
    <ComicSeriesScreenWrapper isHeaderVisible={isHeaderVisible} comicseries={comicseries}>
      <FlashList
        data={getListData()}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={300}
        onScroll={(event) => {
          const yOffset = event.nativeEvent.contentOffset.y;
          if (yOffset <= 0) {
            setIsHeaderVisible(true);
          }
        }}
        refreshControl={
          <ThemedRefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
          />
        }
      />
    </ComicSeriesScreenWrapper>
  );
}

interface ComicSeriesScreenWrapperProps {
  children: React.ReactNode;
  isHeaderVisible: boolean;
  comicseries: ComicSeries | null;
}

const ComicSeriesScreenWrapper = memo(({ children, isHeaderVisible, comicseries }: ComicSeriesScreenWrapperProps) => {
  return (
    <Screen style={styles.container}>
      {isHeaderVisible && (
        <View>
          <HeaderBackButton />
          <HeaderShareButton type="comicseries" item={comicseries} />
        </View>
      )}
      {children}
    </Screen>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 