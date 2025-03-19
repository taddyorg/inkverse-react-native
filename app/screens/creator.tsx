import React, { useEffect, useReducer, useMemo, useCallback, memo } from 'react';
import { RefreshControl, ActivityIndicator, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlashList } from '@shopify/flash-list';
import { useRoute } from '@react-navigation/native';
import { RootStackParamList, CREATOR_SCREEN } from '@/constants/Navigation';
import { publicClient } from '@/lib/apollo';

import { CreatorDetails, CreatorPageType } from '@/app/components/creator/CreatorDetails';
import { CreatorComics } from '@/app/components/creator/CreatorComics';
import { HeaderBackButton, HeaderShareButton, Screen, ScreenHeader } from '@/app/components/ui';

import { creatorQueryReducer, getCreatorScreen, creatorInitialState } from '@/shared/dispatch/creator';
import { ComicSeries, Creator } from '@/shared/graphql/types';

type CreatorListItem =
  | { type: 'screen-header'; key: string; data: { name: string } }
  | { type: 'details'; key: string; data: Creator }
  | { type: 'comics'; key: string; data: { comicseries: ComicSeries[] | null | undefined } };

export type CreatorScreenParams = {
  uuid: string;
};

export function CreatorScreen() {
  const route = useRoute<NativeStackScreenProps<RootStackParamList, typeof CREATOR_SCREEN>['route']>();
  const { uuid } = route.params;
  const [creatorQuery, creatorQueryDispatch] = useReducer(creatorQueryReducer, creatorInitialState);

  const { isLoading, creator, comicseries } = creatorQuery;

  useEffect(() => {
    getCreatorScreen({ publicClient, uuid }, creatorQueryDispatch);
  }, [uuid]);

  const handleRefresh = () => {
    getCreatorScreen({ publicClient, uuid }, creatorQueryDispatch);
  };

  const listData = useMemo((): CreatorListItem[] => {
    if (!creator) return [];
    return [
      { type: 'screen-header', key: 'screen-header', data: { name: creator.name || '' } },
      { type: 'details', key: 'creator-details', data: creator },
      { type: 'comics', key: 'creator-comics', data: { comicseries: comicseries?.filter((series) => series !== null) || [] } },
    ];
  }, [creator, comicseries]);

  const renderItem = useCallback(({ item }: { item: CreatorListItem }) => {
    switch (item.type) {
      case 'screen-header':
        return (
            <ScreenHeader />
        );
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
      <CreatorScreenWrapper creator={creator}>
        <ActivityIndicator size="large" />
      </CreatorScreenWrapper>
    );
  }

  return (
    <CreatorScreenWrapper creator={creator}>
      <FlashList
        data={listData}
        renderItem={renderItem}
        estimatedItemSize={300}
        contentContainerStyle={styles.contentContainer}
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

type CreatorScreenWrapperProps = {
  children: React.ReactNode;
  creator: Creator | null;
}

const CreatorScreenWrapper = memo(({ children, creator }: CreatorScreenWrapperProps) => {
  return (
    <Screen>
      <View>
        <HeaderBackButton />
        <HeaderShareButton type="creator" item={creator} />
      </View>
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
  contentContainer: {
    padding: 16,
  },
});