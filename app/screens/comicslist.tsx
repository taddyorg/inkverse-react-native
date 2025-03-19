import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { useState, useCallback, useEffect, useReducer } from 'react';

import { Screen, ThemedText, ThemedTextSize, PressableOpacity, ScreenHeader, HeaderBackButton, ThemedActivityIndicator } from '@/app/components/ui';
import { ComicSeries, Genre } from '@/shared/graphql/types';
import { Colors } from '@/constants/Colors';
import { ComicSeriesDetails, ComicSeriesPageType } from '@/app/components/comics/ComicSeriesDetails';
import { publicClient } from '@/lib/apollo';
import { comicsListReducer, comicsListInitialState, fetchComics } from '@/shared/dispatch/comicslist';
import { COMICSERIES_SCREEN } from '@/constants/Navigation';

// Define page types for the Comics List screen
export enum ComicsListPageType {
  TAG = 'tag',
  GENRE = 'genre',
}

// Define params for the Comics List screen
export interface ComicsListScreenParams {
  pageType: ComicsListPageType;
  value: string;
}

const LIMIT_PER_PAGE = 15; // Items per page for grid view

export function ComicsListScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { pageType, value } = route.params as ComicsListScreenParams;
  
  const [currentPage, setCurrentPage] = useState(1);
  
  // Set up the reducer for comics list state
  const [state, dispatch] = useReducer(comicsListReducer, comicsListInitialState);
  const { isLoading, isLoadingMore, comics, hasMore } = state;

  const title = pageType === ComicsListPageType.TAG ? value : value.replace('COMICSERIES_', '').replace(/_/g, ' ');

  // Function to fetch comics
  const fetchComicsData = useCallback((page: number) => {
    const filterParams: any = {};
    
    // Add specific filters based on page type
    if (pageType === ComicsListPageType.TAG) {
      filterParams.filterForTags = [value];
    } else if (pageType === ComicsListPageType.GENRE) {
      filterParams.filterForGenres = [value as Genre];
    }
    
    fetchComics({
      publicClient,
      page,
      limitPerPage: LIMIT_PER_PAGE,
      filterForTypes: ["COMICSERIES"],
      ...filterParams,
      isLoadingMore: page > 1,
    }, dispatch);
    
    setCurrentPage(page);
  }, [pageType, value]);

  // Effect to fetch comics when the screen loads or when filters change
  useEffect(() => {
    fetchComicsData(1);
  }, [pageType, value, fetchComicsData]);

  // Handle loading more results
  const handleLoadMore = useCallback(() => {
    if (isLoading || isLoadingMore || !hasMore) return;
    
    const nextPage = currentPage + 1;
    fetchComicsData(nextPage);
  }, [currentPage, isLoading, isLoadingMore, hasMore, fetchComicsData]);

  // Navigate to comic series detail
  const handleComicPress = useCallback((comicseries: ComicSeries) => {
    navigation.navigate(COMICSERIES_SCREEN, { uuid: comicseries.uuid });
  }, [navigation]);

  // Render grid item
  const renderGridItem = useCallback(({ item }: { item: ComicSeries }) => (
    <View style={styles.gridItem}>
      <PressableOpacity 
        onPress={() => handleComicPress(item)}
        style={styles.gridItemInner}
      >
        <ComicSeriesDetails 
          comicseries={item}
          pageType={ComicSeriesPageType.GRID_ITEM}
        />
      </PressableOpacity>
    </View>
  ), [handleComicPress]);

  // Render header component
  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <ScreenHeader />
      <HeaderBackButton />
      <ThemedText size={ThemedTextSize.title} style={styles.title}>
        {title}
      </ThemedText>
    </View>
  ), [title]);

  // Render footer component (load more button or loading indicator)
  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={styles.footerContainer}>
          <ThemedActivityIndicator />
        </View>
      );
    }
    
    if (!isLoading && comics.length > 0 && hasMore) {
      return (
        <View style={styles.footerContainer}>
          <PressableOpacity 
            onPress={handleLoadMore}
            style={styles.loadMoreButton}
          >
            <ThemedText style={styles.loadMoreText}>
              Load More
            </ThemedText>
          </PressableOpacity>
        </View>
      );
    }
    
    return null;
  }, [isLoadingMore, isLoading, comics.length, hasMore, handleLoadMore]);

  // Main render
  if (isLoading && currentPage === 1) {
    return (
      <Screen>
        <View style={styles.loadingContainer}>
          <ThemedActivityIndicator />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.container}>
        <FlashList
          data={comics}
          renderItem={renderGridItem}
          estimatedItemSize={200}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                No comics found.
              </ThemedText>
            </View>
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 16,
  },
  title: {
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 4,
    height: 180,
  },
  gridItemInner: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.tint + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint + '40',
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  footerContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.tint + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint + '40',
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 