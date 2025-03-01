import React, { useCallback, useReducer, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, ActivityIndicator, StyleSheet, StatusBar, useWindowDimensions, Animated, View, NativeSyntheticEvent, NativeScrollEvent, TouchableWithoutFeedback, Pressable, GestureResponderEvent } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, COMICISSUE_SCREEN } from '@/constants/Navigation';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';

import { Screen } from '../components/ui';

import { publicClient } from '@/lib/apollo';
import { StoryImage } from '../components/comics/StoryImage';
import { GridOfComicIssues } from '../components/comics/GridOfComicIssues';
import { ComicHeader, HEADER_HEIGHT } from '../components/comics/ComicHeader';
import { comicIssueQueryReducer, comicIssueInitialState, loadComicIssue } from '@/shared/dispatch/comicissue';
import { ComicIssue } from '@/shared/graphql/types';
import { getStoryImageUrl } from '@/public/comicstory';

type ListItemType = 'story' | 'grid';

interface ListItem {
  type: ListItemType;
  key: string;
  data: any;
}

export type ComicIssueScreenParams = {
  issueUuid: string;
  seriesUuid: string;
};

const PRELOAD_BATCH_SIZE = 3;

// Define header position constants
const HEADER_OPEN_POSITION = 0;
const HEADER_CLOSED_POSITION = -HEADER_HEIGHT;

const preloadImagesInBatch = async (imageUrls: string[]) => {
  for (let i = 0; i < imageUrls.length; i += PRELOAD_BATCH_SIZE) {
    const batch = imageUrls.slice(i, i + PRELOAD_BATCH_SIZE);
    await Promise.all(batch.map(url => Image.prefetch(url)));
  }
};

export function ComicIssueScreen() {
  const route = useRoute<NativeStackScreenProps<RootStackParamList, typeof COMICISSUE_SCREEN>['route']>();
  const { issueUuid, seriesUuid } = route.params;
  const screenDetails = useWindowDimensions();
  const flatListRef = useRef<FlashList<ListItem>>(null);
  
  // Header animation state
  const headerTranslateY = useRef(new Animated.Value(HEADER_OPEN_POSITION)).current;
  const isHeaderOpen = useRef(true);
  
  // Animate header with spring animation
  const animateHeaderPosition = useCallback((toValue: number) => {
    if (toValue === HEADER_OPEN_POSITION) {
      isHeaderOpen.current = true;
    } else {
      isHeaderOpen.current = false;
    }
    
    Animated.spring(headerTranslateY, {
      toValue,
      useNativeDriver: true,
    }).start();
  }, []);

  const [state, dispatch] = useReducer(comicIssueQueryReducer, comicIssueInitialState);
  const { isComicIssueLoading, comicissue, comicseries, allIssues } = state;

  const loadData = useCallback(async (forceRefresh = false) => {
    await loadComicIssue({
      publicClient,
      issueUuid,
      seriesUuid,
      forceRefresh
    }, dispatch);
  }, [issueUuid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = useCallback(() => {
    loadData(true);
  }, [loadData]);

  const preloadImages = useCallback(async (stories: NonNullable<ComicIssue['stories']>) => {
    const imageUrls = stories
      .map(story => getStoryImageUrl({ storyImageAsString: story?.storyImageAsString }))
      .filter((url): url is string => url !== null);

    try {
      await preloadImagesInBatch(imageUrls);
    } catch (error) {
      console.warn('Error preloading images:', error);
    }
  }, [issueUuid]);

  // Preload images when stories data is available
  useEffect(() => {
    const stories = comicissue?.stories;
    if (stories && stories.length > 0) {
      preloadImages(stories).catch(error => {
        console.warn('Failed to preload some images:', error);
      });
    }
  }, [issueUuid]);

  const listData = useMemo(() => {
    if (!comicissue || !comicseries) return [];

    const storyItems: ListItem[] = comicissue.stories?.map((story) => ({
      type: 'story' as const,
      key: `story-${story?.uuid ?? ''}`,
      data: story,
    })) ?? [];

    const gridItem: ListItem = {
      type: 'grid' as const,
      key: 'grid-of-issues',
      data: {
        comicseries,
        comicissue,
        allIssues,
      },
    };

    return [...storyItems, gridItem];
  }, [comicissue, comicseries, allIssues]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    switch (item.type) {
      case 'story':
        return (
          <StoryImage
            story={item.data}
            screenDetails={screenDetails}
          />
        );
      case 'grid':
        return (
          <GridOfComicIssues
            comicseries={item.data.comicseries}
            comicissue={item.data.comicissue}
            allIssues={item.data.allIssues}
          />
        );
      default:
        return null;
    }
  }, [screenDetails]);

  // Handle tap on content to toggle header
  const handleTap = useCallback(() => {
    if (isHeaderOpen.current) {
      animateHeaderPosition(HEADER_CLOSED_POSITION);
    } else {
      animateHeaderPosition(HEADER_OPEN_POSITION);
    }
  }, [animateHeaderPosition]);

  // Handle scroll events to show/hide header
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const y = contentOffset.y;
    
    // Show header when at top
    if (y <= 0 && !isHeaderOpen.current) {
      animateHeaderPosition(HEADER_OPEN_POSITION);
    } 
    // Hide header when scrolling in the middle
    else if (y > 0 && y <= (contentSize.height) - (layoutMeasurement.height + 50) && isHeaderOpen.current) {
      animateHeaderPosition(HEADER_CLOSED_POSITION);
    } 
    // Show header when at bottom
    else if (y > (contentSize.height) - layoutMeasurement.height && !isHeaderOpen.current) {
      animateHeaderPosition(HEADER_OPEN_POSITION);
    }
  }, [animateHeaderPosition]);

  // Custom wrapper for FlashList items to handle taps
  const TappableItem = useCallback(({ item }: { item: ListItem }) => {
    const content = renderItem({ item });
    
    return (
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={{ flex: 1 }}>
          {content}
        </View>
      </TouchableWithoutFeedback>
    );
  }, [renderItem, handleTap]);

  if (isComicIssueLoading && !comicissue) {
    return (
      <Screen style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </Screen>
    );
  }

  if (!comicissue || !comicseries) {
    return (
      <Screen style={styles.loadingContainer}/>
    );
  }

  return (
    <Screen style={styles.container}>
      <StatusBar hidden={true} />
      <ComicHeader 
        headerPosition={headerTranslateY} 
        comicseries={comicseries} 
        comicissue={comicissue} 
      />
      <FlashList
        ref={flatListRef}
        data={listData}
        renderItem={TappableItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={screenDetails.height * 0.8}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl refreshing={isComicIssueLoading} onRefresh={handleRefresh} />
        }
        estimatedListSize={{
          height: screenDetails.height,
          width: screenDetails.width
        }}
      />
    </Screen>
  );
}

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
