import { useReducer, useState, useCallback, useEffect, memo } from 'react';
import { StyleSheet, View, RefreshControl, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/app/components/ui';
import { ComicSeriesDetails, ComicSeriesPageType } from '@/app/components/comics/ComicSeriesDetails';
import { ComicIssuesList, ComicIssuesListProps } from '@/app/components/comics/ComicIssuesList';

import { publicClient } from '@/lib/apollo';
import { ComicSeries } from '@/shared/graphql/types';
import { loadComicSeries, comicSeriesQueryReducerDefault, comicSeriesInitialState } from '@/shared/dispatch/comicseries';

export interface ComicSeriesScreenParams {
  uuid: string;
};

type ListItem = 
  | { type: 'header'; data: ComicSeries }
  | { type: 'issues'; data: ComicIssuesListProps };

export function ComicSeriesScreen() {
  const route = useRoute();
  const { uuid } = route.params as ComicSeriesScreenParams;
  
  const [comicSeriesState, dispatch] = useReducer(comicSeriesQueryReducerDefault, comicSeriesInitialState);
  const [refreshing, setRefreshing] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const { isComicSeriesLoading, comicseries, issues } = comicSeriesState;

  useEffect(() => {
    loadComicSeries({ publicClient, uuid }, dispatch);
  }, [uuid]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadComicSeries({ publicClient, uuid }, dispatch);
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
        return <ComicIssuesList issues={item.data.issues} comicseries={item.data.comicseries} />;
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
      { type: 'issues', data: { issues, comicseries } },
    ];
  }, [comicseries, issues]);

  if (isComicSeriesLoading) {
    return (
      <ComicSeriesScreenWrapper isHeaderVisible={isHeaderVisible}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ComicSeriesScreenWrapper>
    );
  }

  return (
    <ComicSeriesScreenWrapper isHeaderVisible={isHeaderVisible}>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </ComicSeriesScreenWrapper>
  );
}

interface ComicSeriesScreenWrapperProps {
  children: React.ReactNode;
  isHeaderVisible: boolean;
}

const ComicSeriesScreenWrapper = memo(({ children, isHeaderVisible }: ComicSeriesScreenWrapperProps) => {
  const navigation = useNavigation();
  
  return (
    <Screen style={styles.container}>
      <StatusBar hidden={true} />
      {isHeaderVisible && (
        <View>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.shareButton} 
            onPress={() => {/* TODO: Implement share functionality */}}
          >
            <Ionicons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
  shareButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 1,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
  },
}); 