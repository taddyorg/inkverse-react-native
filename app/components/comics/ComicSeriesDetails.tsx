import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

import { ThemedText, ThemedTextFont, ThemedTextSize } from '../ui/ThemedText';
import { ThemedView } from '../ui/ThemedView';
import { CreatorDetails, CreatorPageType } from '../creator/CreatorDetails';

import { COMICSERIES_SCREEN, CREATOR_SCREEN } from '@/constants/Navigation';
import { ComicSeries, Genre } from '@/shared/graphql/types';
import { getBannerImageUrl, getCoverImageUrl, getThumbnailImageUrl } from '@/public/comicseries';
import { ComicSeriesImageVariant } from '@/public/comicseries';
import { getPrettyGenre } from '@/public/genres';

export enum ComicSeriesPageType {
  COMICSERIES_SCREEN = 'COMICSERIES_SCREEN',
  FEATURED_BANNER = 'FEATURED_BANNER',
  MOST_POPULAR = 'MOST_POPULAR',
  COVER = 'COVER',
  SEARCH = 'SEARCH',
  LIST = 'LIST',
}

interface ComicSeriesDetailsProps {
  comicseries: ComicSeries | null | undefined;
  pageType: ComicSeriesPageType;
  firstIssue?: any;
  index?: number;
  isHeaderVisible?: boolean;
  onHeaderVisibilityChange?: (isVisible: boolean) => void;
}

export function ComicSeriesDetails({ comicseries, pageType, firstIssue, index, isHeaderVisible, onHeaderVisibilityChange }: ComicSeriesDetailsProps) {
  const navigation = useNavigation();

  if (!comicseries) return null;

  const handlePressForNavigation = () => {
    navigation.navigate(COMICSERIES_SCREEN, { 
      uuid: comicseries.uuid
    });
  };

  const handlePressForShowAndHideHeader = () => {
    const newVisibility = !isHeaderVisible;
    onHeaderVisibilityChange?.(newVisibility);
  };

  const formatGenres = (comicseries: ComicSeries) => {
    const genres = [comicseries.genre0, comicseries.genre1, comicseries.genre2];
    return genres.filter(Boolean).map(genre => getPrettyGenre(genre as Genre)).join('  •  ');
  };

  switch (pageType) {
    case ComicSeriesPageType.MOST_POPULAR:
      return (
        <TouchableOpacity onPress={handlePressForNavigation} style={styles.popularContainer}>
          <Image
            source={getThumbnailImageUrl({ thumbnailImageAsString: comicseries.thumbnailImageAsString })}
            style={styles.popularImage}
            contentFit="contain"
          />
          <View style={styles.popularContent}>
            <ThemedText style={styles.popularTitle}>{comicseries.name}</ThemedText>
            <ThemedText style={styles.genreText}>{formatGenres(comicseries)}</ThemedText>
          </View>
        </TouchableOpacity>
      );

    case ComicSeriesPageType.FEATURED_BANNER:
      return (
        <TouchableOpacity onPress={handlePressForNavigation} style={styles.featuredContainer}>
          <Image
            source={getBannerImageUrl({ bannerImageAsString: comicseries.bannerImageAsString, variant: ComicSeriesImageVariant.LARGE })}
            style={styles.featuredImage}
            contentFit="cover"
          />
        </TouchableOpacity>
      );

    case ComicSeriesPageType.COVER:
      return (
        <TouchableOpacity onPress={handlePressForNavigation}>
          <Image
            source={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString })}
            style={styles.coverImage}
            contentFit="contain"
          />
        </TouchableOpacity>
      );

    case ComicSeriesPageType.COMICSERIES_SCREEN:
      return (
        <ThemedView style={styles.container}>
          <Pressable onPress={handlePressForShowAndHideHeader}>
            <Image
              source={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString })}
              style={styles.coverImageFullWidth}
              contentFit="cover"
            />
          </Pressable>
          <View style={styles.infoContainer}>
            <ThemedText size={ThemedTextSize.title} style={styles.title}>{comicseries.name} </ThemedText>
            <ThemedText style={styles.genreText}>
              {formatGenres(comicseries)}
            </ThemedText>
            <View style={styles.creatorContainer}>
              <View style={styles.creatorGrid}>
                {comicseries.creators?.map((creator, index) => (
                  <CreatorDetails 
                    key={creator?.uuid} 
                    creator={creator} 
                    pageType={CreatorPageType.MINI_CREATOR} 
                  />
                ))}
              </View>
            </View>
            <ThemedText style={styles.description}>
              {comicseries.description?.trim()}
            </ThemedText>
            <View style={styles.tagsContainer}>
              {comicseries.tags?.map((tag, index) => (
                <View key={tag?.toLowerCase()} style={styles.tag}>
                  <ThemedText style={styles.tagText}>
                    {tag?.toLowerCase()}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </ThemedView>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverImage: {
    height: 220,
    aspectRatio: 4 / 6,
    borderRadius: 6,
  },
  coverImageFullWidth: {
    height: Dimensions.get('window').width * 6 / 4,
    width: '100%',
    borderRadius: 1,
  },
  infoContainer: {
    marginHorizontal: 16,
  },
  genreInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genreText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: ThemedTextFont.semiBold,
    marginBottom: 8,
  },
  title: {
    marginTop: 12,
    marginBottom: 2,
  },
  creatorContainer: {
    marginBottom: 2,
  },
  creatorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  creatorWrapper: {
    width: '50%',
    paddingHorizontal: 8,
  },
  creator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  creatorAvatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  creatorText: {
    fontSize: 18,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#fff',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 16,
  },
  featuredContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxHeight: 470,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  popularContainer: {
    flexDirection: 'row',
    padding: 8,
    marginBottom: 12,
  },
  popularImage: {
    height: 128,
    aspectRatio: 1,
    borderRadius: 4,
  },
  popularContent: {
    flex: 1,
    padding: 12,
  },
  popularTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
}); 