import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

import { ThemedTextSize, ThemedText, ThemedView } from '../ui';

import { getAvatarImageUrl } from '@/public/creator';
import { type Creator } from '@/shared/graphql/operations';
import { CREATOR_SCREEN } from '@/constants/Navigation';
import { useNavigation } from '@react-navigation/native';

export enum CreatorPageType {
  CREATOR_SCREEN = 'CREATOR_SCREEN',
  MINI_CREATOR = 'MINI_CREATOR',
}

export interface CreatorDetailsProps {
  creator: Creator | null | undefined;
  pageType: CreatorPageType;
}

const { width } = Dimensions.get('window');

export function CreatorDetails({ creator, pageType }: CreatorDetailsProps) {
  if (!creator) { return null; }

  const avatarUrl = getAvatarImageUrl({ avatarImageAsString: creator.avatarImageAsString });

  if (pageType === CreatorPageType.MINI_CREATOR) {
    const navigation = useNavigation();

    return (
      <TouchableOpacity 
        onPress={() => {
            if (!creator) { return; }
            navigation.navigate(CREATOR_SCREEN, { uuid: creator.uuid });
          }}
          style={styles.creatorWrapper}
        >
          <View style={styles.creator}>
            <Image
              source={{ uri: getAvatarImageUrl({ avatarImageAsString: creator?.avatarImageAsString }) }}
              style={styles.creatorAvatar}
            />
            <ThemedText size={ThemedTextSize.subtitle} style={styles.creatorText}>
              {creator?.name}
            </ThemedText>
          </View>
        </TouchableOpacity>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Image 
        source={{ uri: avatarUrl }} 
        style={styles.avatar}
        resizeMode="cover"
      />
      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.name}>{creator.name}</ThemedText>
        {creator.bio && (
          <ThemedText style={styles.bio} numberOfLines={3}>
            {creator.bio}
          </ThemedText>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  avatar: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: (width * 0.2) / 2,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
}); 