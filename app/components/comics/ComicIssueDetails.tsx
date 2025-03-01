import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ThemedText, ThemedTextSize, PressableOpacity } from '@/app/components/ui';
import { ComicIssue, ComicSeries } from '@/shared/graphql/types';
import { prettyFormattedDate, prettyFormattedFreeInDays } from '@/shared/utils/date';
import { Colors } from '@/constants/Colors';
import { getThumbnailImageUrl } from '@/public/comicseries';
import { useNavigation } from '@react-navigation/native';
import { COMICISSUE_SCREEN } from '@/constants/Navigation';

interface ComicIssueDetailsProps {
  comicissue: ComicIssue;
  comicseries: ComicSeries;
  position: number;
  isCurrentIssue: boolean;
}

export const ComicIssueDetails = memo(({ comicissue, comicseries, position, isCurrentIssue }: ComicIssueDetailsProps) => {
  const navigation = useNavigation();
  const isPatreonExclusive = comicissue.scopesForExclusiveContent?.includes('patreon');
  const freeInDays = comicissue.dateExclusiveContentAvailable != null 
    ? prettyFormattedFreeInDays(comicissue.dateExclusiveContentAvailable) 
    : undefined;

  const thumbnailImageUrl = getThumbnailImageUrl({ thumbnailImageAsString: comicissue.thumbnailImageAsString });

  const handlePress = () => {
    navigation.navigate(COMICISSUE_SCREEN, {
      issueUuid: comicissue.uuid,
      seriesUuid: comicseries.uuid,
    });
  };

  return (
    <PressableOpacity onPress={handlePress}>
      <View style={[
        styles.episodeItemContainer, 
        isCurrentIssue && styles.currentIssueContainer
      ]}>
        <View style={styles.episodeItemLeft}>
          <View style={[
            styles.thumbnailContainer, 
            isPatreonExclusive && styles.patreonExclusiveContainer,
          ]}>
            <Image
              style={[
                styles.thumbnailImage, 
                isPatreonExclusive && styles.thumbnailImageLocked,
              ]}
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
              style={[
                styles.episodeName,
                isCurrentIssue && styles.currentIssueText
              ]}
              numberOfLines={1}
            >
              {comicissue.name}
            </ThemedText>
            <View style={styles.episodeMetadata}>
                {comicissue.datePublished && (
                <ThemedText style={[
                  styles.dateText,
                  isCurrentIssue && styles.currentIssueText
                ]}>
                  {prettyFormattedDate(new Date(comicissue.datePublished * 1000))}
                </ThemedText>
              )}
              {freeInDays && freeInDays > 0 && (
                <View style={styles.freeInDaysContainer}>
                  <ThemedText style={[
                    styles.bulletPoint,
                    isCurrentIssue && styles.currentIssueText
                  ]}>·</ThemedText>
                  <ThemedText style={[
                    styles.freeInDaysText,
                    isCurrentIssue && styles.currentIssueText
                  ]}>
                    Free in {freeInDays} day{freeInDays > 1 ? 's' : ''}
                  </ThemedText>
                </View>
              )}
              {isPatreonExclusive && (
                <ThemedText style={[
                  styles.patreonExclusiveText,
                  isCurrentIssue && styles.currentIssueText
                ]}>
                  PATREON EXCLUSIVE
                </ThemedText>
              )}
            </View>
          </View>
          <ThemedText style={[
            styles.episodeNumber,
            isCurrentIssue && styles.currentIssueText
          ]}>#{position + 1}</ThemedText>
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
  },
  currentIssueContainer: {
    backgroundColor: Colors.light.action,
    paddingVertical: 8,
    borderRadius: 16,
    // marginVertical: 12,
  },
  episodeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  episodeItemContent: {
    marginLeft: 16,
    flex: 1,
  },
  episodeName: {
    flexShrink: 1,
    flexWrap: 'wrap',
    paddingRight: 4,
    fontSize: 16,
    lineHeight: 20,
  },
  currentIssueText: {
    color: Colors.light.actionText,
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
    flexWrap: 'wrap',
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