import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

import { ThemedText } from '../ui/ThemedText';
import { ThemedView } from '../ui/ThemedView';

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
}

export function ComicSeriesDetails({ comicseries, pageType, firstIssue, index }: ComicSeriesDetailsProps) {
  const navigation = useNavigation();

  if (!comicseries) return null;

  const handlePress = () => {
    // TODO: Implement navigation using shortUrl
    // navigation.navigate('ComicSeriesDetail', { shortUrl: comicseries.shortUrl });
  };

  const formatGenres = (comicseries: ComicSeries) => {
    const genres = [comicseries.genre0, comicseries.genre1, comicseries.genre2];
    return genres.filter(Boolean).map(genre => getPrettyGenre(genre as Genre)).join('  •  ');
  };

  switch (pageType) {
    case ComicSeriesPageType.MOST_POPULAR:
      return (
        <TouchableOpacity onPress={handlePress} style={styles.popularContainer}>
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
        <TouchableOpacity onPress={handlePress} style={styles.featuredContainer}>
          <Image
            source={getBannerImageUrl({ bannerImageAsString: comicseries.bannerImageAsString, variant: ComicSeriesImageVariant.LARGE })}
            style={styles.featuredImage}
            contentFit="cover"
          />
        </TouchableOpacity>
      );

    case ComicSeriesPageType.COVER:
      return (
        <TouchableOpacity onPress={handlePress}>
          <Image
            source={getCoverImageUrl({ coverImageAsString: comicseries.coverImageAsString })}
            style={styles.coverImage}
            contentFit="contain"
          />
        </TouchableOpacity>
      );

    default:
      return null;
  }
}

const styles = StyleSheet.create({
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
    fontWeight: 'bold',
    marginBottom: 8,
  },
  genreText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  coverImage: {
    height: 220,
    aspectRatio: 4 / 6,
    borderRadius: 6,
  },
  coverTitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
}); 