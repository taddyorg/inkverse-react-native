import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

import { ThemedText, ThemedTextFontFamilyMap, PressableOpacity } from '../ui';

import { ComicIssue } from '@/shared/graphql/types';
import { getThumbnailImageUrl } from '@/public/comicissue';

interface ReadNextEpisodeProps {
  comicissue: ComicIssue;
  showEmptyState?: boolean;
  firstTextCTA?: string;
  secondTextCTA?: string;
  handleNavigateToIssue: (issueUuid: string, seriesUuid: string) => void;
}

export function ReadNextEpisode({ comicissue, showEmptyState = true, firstTextCTA = 'NEXT', secondTextCTA = 'EPISODE', handleNavigateToIssue }: ReadNextEpisodeProps) {
  if (!comicissue) {
    if (!showEmptyState) { return null; }
    return (
      <View style={styles.container}>
        <View style={styles.endButtonContainer}>
          <ThemedText style={styles.emptyText}>
            You are up to date with this series!
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PressableOpacity
        style={styles.button} 
        onPress={() => {
          if (handleNavigateToIssue && comicissue.uuid && comicissue.seriesUuid) {
            handleNavigateToIssue(comicissue.uuid, comicissue.seriesUuid);
          }
        }}
      >
        <View style={styles.nextIssueButtonContainer}>
          {comicissue.thumbnailImageAsString && (
            <View>
              <Image
                source={getThumbnailImageUrl({ thumbnailImageAsString: comicissue.thumbnailImageAsString })}
                style={styles.thumbnail}
                contentFit="cover"
              />
            </View>
          )}
          <View style={styles.titleContainer}>
            <ThemedText style={styles.title}>{firstTextCTA.toUpperCase()}</ThemedText>
            <ThemedText style={styles.title}>{secondTextCTA.toUpperCase()}</ThemedText>
          </View>
        </View>
      </PressableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  button: {
    width: '100%',
    overflow: 'hidden',
  },
  nextIssueButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: '#fff', // PAPER_PINK equivalent
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#E05151', // BRAND_PINK equivalent
  },
  thumbnail: {
    width: 104,
    height: 104,
    borderRadius: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: ThemedTextFontFamilyMap.bold,
    color: '#E05151', // BRAND_PINK equivalent
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  endButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
  },
}); 