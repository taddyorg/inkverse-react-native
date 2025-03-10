import { useReducer, useState, useCallback, useEffect, memo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, RefreshControl, ActivityIndicator, FlatList, ListRenderItem } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { FlashList } from '@shopify/flash-list';

import { Screen, ThemedText, ThemedTextFont } from '@/app/components/ui';
import { ComicSeriesDetails, ComicSeriesPageType } from '@/app/components/comics/ComicSeriesDetails';
import { Header } from '@/app/components/home/Header';

import { publicClient } from '@/lib/apollo';
import { ComicSeries, List } from '@/shared/graphql/types';
import { loadHomeScreen, homefeedQueryReducerDefault, homeScreenInitialState } from '@/shared/dispatch/homefeed';

// Section types for FlashList
type SectionType = 
  | { type: 'header' }
  | { type: 'featured'; data: ComicSeries[] | null | undefined }
  | { type: 'mostRecommended'; data: ComicSeries[] | null | undefined }
  | { type: 'curatedLists'; data: List[] | null | undefined }
  | { type: 'recentlyUpdated'; data: ComicSeries[] | null | undefined }
  | { type: 'recentlyAdded'; data: ComicSeries[] | null | undefined };

export function HomeScreen() {
  const [homeScreenState, dispatch] = useReducer(homefeedQueryReducerDefault, homeScreenInitialState);
  const [refreshing, setRefreshing] = useState(false);
  const flashListRef = useRef<FlashList<SectionType>>(null);
  
  useScrollToTop(flashListRef);

  const { isHomeScreenLoading, featuredComicSeries, curatedLists, mostPopularComicSeries, recentlyAddedComicSeries, recentlyUpdatedComicSeries } = homeScreenState;

  useEffect(() => {
    loadHomeScreen({ publicClient }, dispatch);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHomeScreen({ publicClient }, dispatch);
    setRefreshing(false);
  }, []);

  // Create data for FlashList
  const sections = useCallback((): SectionType[] => {
    if (isHomeScreenLoading) {
      return [];
    }
    
    return [
      { type: 'header' },
      { type: 'featured', data: featuredComicSeries },
      { type: 'mostRecommended', data: mostPopularComicSeries },
      { type: 'curatedLists', data: curatedLists },
      { type: 'recentlyUpdated', data: recentlyUpdatedComicSeries },
      { type: 'recentlyAdded', data: recentlyAddedComicSeries },
    ];
  }, [
    isHomeScreenLoading, 
    featuredComicSeries, 
    mostPopularComicSeries, 
    curatedLists, 
    recentlyUpdatedComicSeries, 
    recentlyAddedComicSeries
  ]);

  // Render each section type
  const renderItem = useCallback(({ item }: { item: SectionType }) => {
    switch (item.type) {
      case 'header':
        return <Header />;
      case 'featured':
        return <FeaturedWebtoons comicSeries={item.data} />;
      case 'mostRecommended':
        return <MostRecommendedWebtoons comicSeries={item.data} />;
      case 'curatedLists':
        return <CuratedLists lists={item.data} />;
      case 'recentlyUpdated':
        return <RecentlyUpdatedWebtoons comicSeries={item.data} />;
      case 'recentlyAdded':
        return <RecentlyAddedWebtoons comicSeries={item.data} />;
      default:
        return null;
    }
  }, []);

  const keyExtractor = useCallback((item: SectionType, index: number) => `${item.type}-${index}`, []);

  if (isHomeScreenLoading) {
    return (
      <Screen style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large"/>
        </View>
      </Screen>
    );
  }

  return (
    <Screen style={styles.container}>
      <StatusBar hidden={true} />
      <FlashList
        ref={flashListRef}
        data={sections()}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        estimatedItemSize={300}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
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
          imagePriority="high"
        />
      )}
    </View>
  );
});

const MostRecommendedWebtoons = memo(({ comicSeries }: { comicSeries: ComicSeries[] | null | undefined }) => {
  const renderItem: ListRenderItem<ComicSeries> = useCallback(({ item, index }) => (
    <ComicSeriesDetails
      comicseries={item}
      pageType={ComicSeriesPageType.MOST_POPULAR}
      imagePriority={index === 0 ? 'normal' : 'low'}
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
  const renderItem: ListRenderItem<List> = useCallback(({ item, index }) => (
    <TouchableOpacity style={styles.curatedListItem}>
      <Image
        source={{ uri: item.bannerImageUrl ?? '' }}
        style={styles.curatedListImage}
        contentFit="cover"
        recyclingKey={item.id}
        priority={index === 0 ? 'normal' : 'low'}
      />
    </TouchableOpacity>
  ), []);

  const keyExtractor = (item: List) => item.id;

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
  const renderItem: ListRenderItem<ComicSeries> = useCallback(({ item, index }) => (
    <View style={styles.horizontalComicItem}>
      <ComicSeriesDetails
        comicseries={item}
        pageType={ComicSeriesPageType.COVER}
        imagePriority={index === 0 ? 'normal' : 'low'}
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
  const renderItem: ListRenderItem<ComicSeries> = useCallback(({ item, index }) => (
    <View style={styles.horizontalComicItem}>
      <ComicSeriesDetails
        comicseries={item}
        pageType={ComicSeriesPageType.COVER}
        imagePriority={index === 0 ? 'normal' : 'low'}
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
  scrollContent: {
    padding: 16,
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
    fontFamily: ThemedTextFont.bold,
    marginBottom: 8,
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