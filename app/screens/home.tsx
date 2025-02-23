import { useReducer, useState, useCallback, useEffect, memo, useRef } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Image, RefreshControl, ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';

import { Screen, ThemedText } from '@/app/components/ui';
import { ComicSeriesDetails, ComicSeriesPageType } from '@/app/components/comics/ComicSeriesDetails';
import { Header } from '@/app/components/home/Header';

import { publicClient } from '@/lib/apollo';
import { ComicSeries, List } from '@/shared/graphql/types';
import { loadHomeScreen, homefeedQueryReducerDefault, homeScreenInitialState } from '@/shared/dispatch/homefeed';

export function HomeScreen() {
  const [homeScreenState, dispatch] = useReducer(homefeedQueryReducerDefault, homeScreenInitialState);
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  useScrollToTop(scrollViewRef);

  const { isHomeScreenLoading, featuredComicSeries, curatedLists, mostPopularComicSeries, recentlyAddedComicSeries, recentlyUpdatedComicSeries } = homeScreenState;

  useEffect(() => {
    loadHomeScreen({ publicClient }, dispatch);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHomeScreen({ publicClient }, dispatch);
    setRefreshing(false);
  }, []);

  return (
    <Screen style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isHomeScreenLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large"/>
          </View>
        ) : (
          <View>
            <Header />
            <FeaturedWebtoons comicSeries={featuredComicSeries} />
            <MostRecommendedWebtoons comicSeries={mostPopularComicSeries} />
            <CuratedLists lists={curatedLists} />
            <RecentlyUpdatedWebtoons comicSeries={recentlyUpdatedComicSeries} />
            <RecentlyAddedWebtoons comicSeries={recentlyAddedComicSeries} />
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const FeaturedWebtoons = memo(({ comicSeries }: { comicSeries: ComicSeries[] | null | undefined }) => {
  const firstComicSeries = comicSeries?.[0];
  return (
    <View style={styles.section}>
      {firstComicSeries && (
        <ComicSeriesDetails
          comicseries={firstComicSeries}
          pageType={ComicSeriesPageType.FEATURED_BANNER}
        />
      )}
    </View>
  );
});

const MostRecommendedWebtoons = memo(({ comicSeries }: { comicSeries: ComicSeries[] | null | undefined }) => {
  const renderItem: ListRenderItem<ComicSeries> = useCallback(({ item }) => (
    <ComicSeriesDetails
      comicseries={item}
      pageType={ComicSeriesPageType.MOST_POPULAR}
    />
  ), []);

  const keyExtractor = useCallback((item: ComicSeries) => item.uuid, []);

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Most Recommended Comics</ThemedText>
      <FlatList
        data={comicSeries ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
});

const CuratedLists = memo(({ lists }: { lists: List[] | null | undefined }) => {
  const renderItem: ListRenderItem<List> = useCallback(({ item }) => (
    <TouchableOpacity style={styles.curatedListItem}>
      <Image
        source={{ uri: item.bannerImageUrl ?? '' }}
        style={styles.curatedListImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  ), []);

  const keyExtractor = useCallback((item: List) => item.id.toString(), []);

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Picks by Inkverse</ThemedText>
      <FlatList
        data={lists ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      />
    </View>
  );
});

const RecentlyUpdatedWebtoons = memo(({ comicSeries }: { comicSeries: ComicSeries[] | null | undefined }) => {
  const renderItem: ListRenderItem<ComicSeries> = useCallback(({ item }) => (
    <View style={styles.horizontalComicItem}>
      <ComicSeriesDetails
        comicseries={item}
        pageType={ComicSeriesPageType.COVER}
      />
    </View>
  ), []);

  const keyExtractor = useCallback((item: ComicSeries) => item.uuid, []);

  return (
    <View style={styles.section}>
      <ThemedText style={styles.sectionTitle}>Recently Updated</ThemedText>
      <FlatList
        data={comicSeries ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      />
    </View>
  );
});

const RecentlyAddedWebtoons = memo(({ comicSeries }: { comicSeries: ComicSeries[] | null | undefined }) => {
  const renderItem: ListRenderItem<ComicSeries> = useCallback(({ item }) => (
    <View style={styles.horizontalComicItem}>
      <ComicSeriesDetails
        comicseries={item}
        pageType={ComicSeriesPageType.COVER}
      />
    </View>
  ), []);

  const keyExtractor = useCallback((item: ComicSeries) => item.uuid, []);

  return (
    <View style={[styles.section, { marginBottom: 6 }]}>
      <ThemedText style={styles.sectionTitle}>Recently Added</ThemedText>
      <FlatList
        data={comicSeries ?? []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  horizontalComicItem: {
    marginRight: 12,
  },
  curatedListItem: {
    width: 340,
    aspectRatio: 16 / 9,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  curatedListImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  footerLinks: {
    marginBottom: 24,
  },
  footerLink: {
    fontSize: 16,
    marginBottom: 12,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 