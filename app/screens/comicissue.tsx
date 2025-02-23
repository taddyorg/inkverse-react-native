import React, { useCallback, useReducer, useEffect, useMemo } from 'react';
import { RefreshControl, ActivityIndicator, StyleSheet, StatusBar, useWindowDimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, COMICISSUE_SCREEN } from '@/constants/Navigation';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';

import { Screen } from '../components/ui';

import { publicClient } from '@/lib/apollo';
import { StoryImage } from '../components/comics/StoryImage';
import { GridOfComicIssues } from '../components/comics/GridOfComicIssues';
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
      <FlashList
        data={listData}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={screenDetails.height * 0.8}
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
