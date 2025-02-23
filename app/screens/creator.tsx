import React, { useEffect, useReducer, useMemo, useCallback, memo } from 'react';
import { RefreshControl, ActivityIndicator, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList, CREATOR_SCREEN } from '@/constants/Navigation';
import { publicClient } from '@/lib/apollo';

import { CreatorDetails, CreatorPageType } from '@/app/components/creator/CreatorDetails';
import { CreatorComics } from '@/app/components/creator/CreatorComics';
import { HeaderBackButton, HeaderShareButton, Screen, ThemedView } from '@/app/components/ui';

import { creatorQueryReducer, getCreatorScreen } from '@/shared/dispatch/creator';
import { ComicSeries, Creator } from '@/shared/graphql/types';

type ListItem =
  | { type: 'details'; key: string; data: Creator }
  | { type: 'comics'; key: string; data: { comicseries: ComicSeries[] | null | undefined } };

export type CreatorScreenParams = {
  uuid: string;
};

export function CreatorScreen() {
  const route = useRoute<NativeStackScreenProps<RootStackParamList, typeof CREATOR_SCREEN>['route']>();
  const { uuid } = route.params;
  const [creatorQuery, creatorQueryDispatch] = useReducer(creatorQueryReducer, {
    isLoading: true,
    creator: null,
    comicseries: null,
  });

  const { isLoading, creator, comicseries } = creatorQuery;

  useEffect(() => {
    getCreatorScreen({ publicClient, uuid }, creatorQueryDispatch);
  }, [uuid]);

  const handleRefresh = () => {
    getCreatorScreen({ publicClient, uuid }, creatorQueryDispatch);
  };

  const listData = useMemo((): ListItem[] => {
    if (!creator) return [];
    return [
      { type: 'details', key: 'creator-details', data: creator },
      { type: 'comics', key: 'creator-comics', data: { comicseries: comicseries?.filter((series) => series !== null) || [] } },
    ];
  }, [creator, comicseries]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    switch (item.type) {
      case 'details':
        return (
          <CreatorDetails 
            creator={item.data}
            pageType={CreatorPageType.CREATOR_SCREEN}
          />
        );
      case 'comics':
        return (
          <CreatorComics 
            comicseries={item.data.comicseries}
          />
        );
      default:
        return null;
    }
  }, []);

  if (isLoading || !creator) {
    return (
      <CreatorScreenWrapper>
        <ActivityIndicator size="large" />
      </CreatorScreenWrapper>
    );
  }

  return (
    <CreatorScreenWrapper>
      <FlashList
        data={listData}
        renderItem={renderItem}
        estimatedItemSize={300}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
          />
        }
      />
    </CreatorScreenWrapper>
  );
}

const CreatorScreenWrapper = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <Screen>
      <View>
        <HeaderBackButton />
        <HeaderShareButton />
      </View>
      <ThemedView style={styles.topPadding}></ThemedView>
      {children}
    </Screen>
  );
});

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topPadding: {
    height: 76,
  },
});