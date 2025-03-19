import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

import { ThemedText, ThemedTextFontFamilyMap, ThemedView, PressableOpacity } from '../ui';
import { CreatorDetails, CreatorPageType } from '../creator/CreatorDetails';

import { COMICSERIES_SCREEN } from '@/constants/Navigation';
import { ComicSeries, ContentRating, Genre } from '@/shared/graphql/types';
import { getBannerImageUrl, getCoverImageUrl, getThumbnailImageUrl } from '@/public/comicseries';
import { ComicSeriesImageVariant } from '@/public/comicseries';
import { getPrettyGenre } from '@/public/genres';
import { getPrettyRating } from '@/public/ratings';
import { Colors } from '@/constants/Colors';

export enum ComicSeriesPageType {
  COMICSERIES_SCREEN = 'COMICSERIES_SCREEN',
  FEATURED_BANNER = 'FEATURED_BANNER',
  MOST_POPULAR = 'MOST_POPULAR',
  COVER = 'COVER',
  SEARCH = 'SEARCH',
  LIST_ITEM = 'LIST_ITEM',
  GRID_ITEM = 'GRID_ITEM',
}

interface ComicSeriesDetailsProps {
  comicseries: ComicSeries | null | undefined;
  pageType: ComicSeriesPageType;
  firstIssue?: any;
  isHeaderVisible?: boolean;
  onHeaderVisibilityChange?: (isVisible: boolean) => void;
  imagePriority?: 'high' | 'normal' | 'low';
}

export function ComicSeriesDetails({ comicseries, pageType, firstIssue, isHeaderVisible, onHeaderVisibilityChange, imagePriority }: ComicSeriesDetailsProps) {
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
            recyclingKey={comicseries.uuid}
            priority={imagePriority}
          />
          <View style={styles.popularContent}>
            <ThemedText style={styles.popularTitle}>{comicseries.name}</ThemedText>
            <ThemedText style={styles.genreTextAlt}>{formatGenres(comicseries)}</ThemedText>
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
            recyclingKey={comicseries.uuid}
            priority={imagePriority}
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
            recyclingKey={comicseries.uuid}
          />
        </TouchableOpacity>
      );

    case ComicSeriesPageType.LIST_ITEM:
      return (
        <PressableOpacity style={styles.comicSeriesItem} onPress={handlePressForNavigation}>
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString })}
                style={styles.listItemImage}
                contentFit="contain"
                recyclingKey={comicseries.uuid}
                priority={imagePriority}
              />
              <View style={styles.comicSeriesContent}>
                <ThemedText size="subtitle" font="bold" style={styles.comicSeriesTitle}>{comicseries.name}</ThemedText>
                <ThemedText style={styles.genreTextAlt2}>
                  {formatGenres(comicseries)}
                </ThemedText>
                {comicseries.description && (
                  <ThemedText style={styles.comicSeriesDescription} numberOfLines={4}>
                    {comicseries.description}
                  </ThemedText>
                )}
              </View>
            </View>
        </PressableOpacity>
      );

    case ComicSeriesPageType.GRID_ITEM:
      return (
        <View style={styles.gridItemContainer}>
          <Image
            source={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString })}
            style={styles.gridItemImage}
            contentFit="cover"
            recyclingKey={comicseries.uuid}
            priority={imagePriority || 'normal'}
          />
        </View>
      );

    case ComicSeriesPageType.COMICSERIES_SCREEN:
      return (
        <ThemedView style={styles.container}>
          <Pressable onPress={handlePressForShowAndHideHeader}>
            <Image
              source={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString })}
              style={styles.coverImageFullWidth}
              contentFit="cover"
              recyclingKey={comicseries.uuid}
              priority="high"
            />
          </Pressable>
          <View style={styles.infoContainer}>
            <ThemedText size="title" style={styles.title}>{comicseries.name} </ThemedText>
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
    fontFamily: ThemedTextFontFamilyMap.bold,
    marginBottom: 8,
  },
  genreTextAlt: {
    fontSize: 16,
    marginBottom: 8,
  },
  genreTextAlt2: {
    fontSize: 16,
    marginBottom: 4,
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
    backgroundColor: Colors.dark.text,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 16,
    color: Colors.dark.background,
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
    marginBottom: 12,
  },
  popularImage: {
    height: 128,
    aspectRatio: 1,
    borderRadius: 8,
  },
  popularContent: {
    flex: 1,
    padding: 12,
  },
  popularTitle: {
    fontSize: 18,
    fontFamily: ThemedTextFontFamilyMap.bold,
    marginBottom: 8,
  },
  // Styles for LIST_ITEM page type
  listItemContainer: {
    flexDirection: 'row',
  },
  listItemImage: {
    height: 200,
    aspectRatio: 4/6,
    borderRadius: 4,
  },
  comicSeriesItem: {
    marginBottom: 20,
  },
  comicSeriesIndex: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  indexText: {
    fontWeight: 'bold',
  },
  comicSeriesContent: {
    flex: 1,
    paddingHorizontal: 12,
  },
  comicSeriesTitle: {
    marginBottom: 2,
  },
  comicSeriesDescription: {
    fontSize: 14,
  },
  gridItemContainer: {
    flex: 1,
  },
  gridItemImage: {
    width: '100%',
    aspectRatio: 2/3,
    borderRadius: 8,
  },
  gridItemContent: {
    padding: 4,
    paddingTop: 6,
  },
  gridItemTitle: {
    textAlign: 'center',
  },
}); 