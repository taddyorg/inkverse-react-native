import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

import { ThemedText, PressableOpacity } from '../ui';
import { ComicIssue, ComicSeries } from '@/shared/graphql/types';
import { getThumbnailImageUrl } from '@/public/comicissue';
import { COMICISSUE_SCREEN } from '@/constants/Navigation';

interface GridOfComicIssuesProps {
  comicseries?: ComicSeries | null;
  comicissue?: ComicIssue | null;
  allIssues: ComicIssue[];
}

interface PreviewComicIssueProps {
  comicissue: ComicIssue;
  isCurrentIssue: boolean;
  onPress: () => void;
}

const PreviewComicIssue = ({ 
  comicissue, 
  isCurrentIssue, 
  onPress 
}: PreviewComicIssueProps) => {
  const isPatreonExclusive = comicissue.scopesForExclusiveContent?.includes('patreon');
  const thumbnailImageUrl = getThumbnailImageUrl({ thumbnailImageAsString: comicissue.thumbnailImageAsString });
  
  if (!thumbnailImageUrl) return null;

  return (
    <PressableOpacity
      style={[
        styles.gridItem,
        isCurrentIssue && styles.currentIssue
      ]}
      disabled={isCurrentIssue}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          style={[
            styles.thumbnailImage,
            isPatreonExclusive && styles.patreeonExclusiveImage
          ]}
          source={{ uri: thumbnailImageUrl }}
          contentFit="cover"
        />
        {isPatreonExclusive && (
          <View style={styles.lockIconContainer}>
            <MaterialIcons name="lock" size={40} color="white" />
          </View>
        )}
      </View>
      <ThemedText style={[
        styles.episodeTitle,
        isCurrentIssue && styles.currentEpisodeTitle,
        isPatreonExclusive && styles.patreonExclusiveTitle
      ]}>
        {comicissue.name} {isPatreonExclusive ? "(PATREON EXCLUSIVE)" : ""}
      </ThemedText>
    </PressableOpacity>
  );
};

export const GridOfComicIssues = ({ comicseries, comicissue, allIssues }: GridOfComicIssuesProps) => {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);

  const handleIssuePress = (issue: ComicIssue) => {
    if (!comicseries?.uuid) return;
    
    navigation.navigate(COMICISSUE_SCREEN, {
      issueUuid: issue.uuid,
      seriesUuid: comicseries.uuid,
    });
  };

  useEffect(() => {
    if (flatListRef.current && comicissue?.uuid) {
      const currentIndex = allIssues.findIndex(issue => issue.uuid === comicissue.uuid);
      if (currentIndex !== -1) {
        flatListRef.current.scrollToIndex({
          index: currentIndex,
          animated: true,
          viewPosition: 0.5 // Center the item
        });
      }
    }
  }, [comicissue?.uuid]);

  const renderItem = ({ item }: { item: ComicIssue }) => (
    <PreviewComicIssue
      comicissue={item}
      isCurrentIssue={item.uuid === comicissue?.uuid}
      onPress={() => handleIssuePress(item)}
    />
  );

  const getItemLayout = (_: any, index: number) => ({
    length: styles.gridItem.width as number,
    offset: (styles.gridItem.width as number) * index,
    index,
  });

  if (!comicseries || !comicissue || allIssues.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>More Episodes</ThemedText>
      <FlatList
        ref={flatListRef}
        data={allIssues}
        renderItem={renderItem}
        keyExtractor={(item) => item.uuid}
        horizontal
        showsHorizontalScrollIndicator={false}
        // snapToInterval={styles.gridItem.width as number}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        style={styles.scrollView}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToIndex({ index: info.index, animated: true });
            }
          });
        }}
      />
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
  scrollView: {
    flexGrow: 0,
  },
  gridItem: {
    width: 140,
    marginRight: 8,
    paddingHorizontal: 4,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  currentIssue: {
    opacity: 0.7,
  },
  thumbnailImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
  },
  patreeonExclusiveImage: {
    opacity: 0.5,
  },
  lockIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  episodeTitle: {
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  currentEpisodeTitle: {
    color: '#FF69B4',
  },
  patreonExclusiveTitle: {
    opacity: 0.6,
  },
}); 