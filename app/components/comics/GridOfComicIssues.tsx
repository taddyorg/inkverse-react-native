import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';

import { ThemedText } from '../ui/ThemedText';
import { ComicIssue, ComicSeries } from '@/shared/graphql/types';
import { getThumbnailImageUrl } from '@/public/comicissue';
import { COMICISSUE_SCREEN } from '@/constants/Navigation';

interface GridOfComicIssuesProps {
  comicseries?: ComicSeries | null;
  comicissue?: ComicIssue | null;
  allIssues: ComicIssue[];
}

export const GridOfComicIssues = ({ comicseries, comicissue, allIssues }: GridOfComicIssuesProps) => {
  const navigation = useNavigation();

  if (!comicseries || !comicissue || allIssues.length === 0) {
    return null;
  }

  const handleIssuePress = (issue: ComicIssue) => {
    navigation.navigate(COMICISSUE_SCREEN, {
      issueUuid: issue.uuid,
      seriesUuid: comicseries.uuid,
    });
  };
  
  const isCurrentIssue = comicissue.uuid === comicissue.uuid;

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>More Episodes</ThemedText>
      <View style={styles.grid}>
        {allIssues.map((issue) => {
          const thumbnailImageUrl = getThumbnailImageUrl({ thumbnailImageAsString: issue.thumbnailImageAsString });
          if (!thumbnailImageUrl) return null;

          return (
            <Pressable
              key={issue.uuid}
              style={[styles.gridItem, isCurrentIssue && styles.currentIssue]}
              onPress={() => handleIssuePress(issue)}
            >
              <Image
                style={styles.thumbnailImage}
                source={{ uri: thumbnailImageUrl }}
                contentFit="cover"
              />
              <ThemedText style={styles.episodeNumber}>Episode {issue.position}</ThemedText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridItem: {
    width: '33.33%',
    padding: 8,
  },
  currentIssue: {
    opacity: 0.5,
  },
  thumbnailImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  episodeNumber: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
}); 