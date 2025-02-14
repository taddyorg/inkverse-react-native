import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ThemedText, ThemedTextSize, PressableOpacity } from '@/app/components/ui';
import { ComicIssue, ComicSeries } from '@/shared/graphql/types';
import { prettyFormattedDate, prettyFormattedFreeInDays } from '@/shared/utils/date';
import { Colors } from '@/constants/Colors';
import { getThumbnailImageUrl } from '@/public/comicseries';

interface ComicIssueDetailsProps {
  issue: ComicIssue;
  series: ComicSeries;
  position: number;
}

export const ComicIssueDetails = memo(({ issue, series, position }: ComicIssueDetailsProps) => {
  const isPatreonExclusive = issue.scopesForExclusiveContent?.includes('patreon');
  const freeInDays = issue.dateExclusiveContentAvailable != null ? 
    prettyFormattedFreeInDays(issue.dateExclusiveContentAvailable) : 
    undefined;

  const thumbnailImageUrl = getThumbnailImageUrl({ thumbnailImageAsString: issue.thumbnailImageAsString });

  return (
    <PressableOpacity>
      <View style={styles.episodeItemContainer}>
        <View style={styles.episodeItemLeft}>
          <View style={[styles.thumbnailContainer, isPatreonExclusive && styles.patreonExclusiveContainer]}>
            <Image
              style={[styles.thumbnailImage, isPatreonExclusive && styles.thumbnailImageLocked]}
              source={{ uri: thumbnailImageUrl }}
              contentFit="cover"
            />
            {isPatreonExclusive && (
              <View style={styles.lockIcon}>
                <Ionicons name="lock-closed" size={24} color={Colors.light.text} />
              </View>
            )}
          </View>
          <View style={styles.episodeItemContent}>
            <ThemedText 
              size={ThemedTextSize.title}
              style={styles.episodeName}
              numberOfLines={1}
            >
              {issue.name}
            </ThemedText>
            <View style={styles.episodeMetadata}>
              {issue.datePublished && (
                <ThemedText style={styles.dateText}>
                  {prettyFormattedDate(new Date(issue.datePublished * 1000))}
                </ThemedText>
              )}
              {freeInDays && freeInDays > 0 && (
                <View style={styles.freeInDaysContainer}>
                  <ThemedText style={styles.bulletPoint}>·</ThemedText>
                  <ThemedText style={styles.freeInDaysText}>
                    Free in {freeInDays} day{freeInDays > 1 ? 's' : ''}
                  </ThemedText>
                </View>
              )}
              {isPatreonExclusive && (
                <ThemedText style={styles.patreonExclusiveText}>
                  PATREON EXCLUSIVE
                </ThemedText>
              )}
            </View>
          </View>
          <ThemedText style={styles.episodeNumber}>#{position + 1}</ThemedText>
        </View>
      </View>
    </PressableOpacity>
  );
});

const styles = StyleSheet.create({
  episodeItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
    height: 64,
  },
  episodeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeItemContent: {
    marginLeft: 16,
    flex: 1,
    marginRight: 8,
  },
  episodeName: {
    flexShrink: 1,
    flexWrap: 'wrap',
    paddingRight: 4,
    fontSize: 16,
    lineHeight: 20,
  },
  thumbnailContainer: {
    width: 64,
    height: 64,
    position: 'relative',
  },
  patreonExclusiveContainer: {
    position: 'relative',
  },
  episodeNumber: {
    fontSize: 16,
  },
  episodeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    opacity: 0.8,
  },
  bulletPoint: {
    marginHorizontal: 4,
    opacity: 0.8,
  },
  freeInDaysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeInDaysText: {
    fontSize: 14,
    color: Colors.light.tint,
  },
  patreonExclusiveText: {
    fontSize: 14,
    color: Colors.light.tint,
    marginTop: 4,
  },
  thumbnailImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
  },
  thumbnailImageLocked: {
    opacity: 0.5,
  },
  lockIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
}); 