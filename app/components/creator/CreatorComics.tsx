import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';

import { COMICSERIES_SCREEN } from '@/constants/Navigation';
import { getCoverImageUrl } from '@/public/comicseries';
import { type ComicSeries } from '@/shared/graphql/operations';
import { ThemedText, ThemedView } from '../ui';

interface CreatorComicsProps {
  comicseries: ComicSeries[] | null | undefined;
}

export function CreatorComics({ comicseries }: CreatorComicsProps) {
  const navigation = useNavigation();

  if (!comicseries || comicseries.length === 0) {
    return null;
  }

  const renderComicItem = ({ item }: { item: ComicSeries }) => {
    const coverUrl = getCoverImageUrl({ coverImageAsString: item.coverImageAsString });

    return (
      <TouchableOpacity
        style={styles.comicItem}
        onPress={() => {
          navigation.navigate(COMICSERIES_SCREEN, { uuid: item.uuid });
        }}
      >
        <Image
          source={{ uri: coverUrl }}
          style={styles.comicCover}
          contentFit="cover"
        />
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>Comics</ThemedText>
      <FlashList
        data={comicseries}
        estimatedItemSize={200}
        renderItem={renderComicItem}
        keyExtractor={(item) => item.uuid}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  listContent: {
    padding: 8,
  },
  comicItem: {
    width: 160,
    marginHorizontal: 8,
    marginBottom: 16,
  },
  comicCover: {
    width: '100%',
    height: 240,
    borderRadius: 8,
    marginBottom: 8,
  },
  comicTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 