import { View, StyleSheet } from 'react-native'
import React, { useReducer, useMemo } from 'react'
import { FlashList } from '@shopify/flash-list';

import { Colors } from '@/constants/Colors';
import { ThemedText } from '../ui';
import { ComicIssue, ComicSeries } from '@/shared/graphql/types';
import { ComicIssueDetails } from './ComicIssueDetails';

export interface ComicIssuesListProps {
  comicissues: ComicIssue[];
  comicseries: ComicSeries;
  currentIssueUuid: string | undefined;
}

export const ComicIssuesList = (props: ComicIssuesListProps) => {
  const { comicissues, comicseries, currentIssueUuid } = props;

  const [tokenQuery, tokenDispatch] = useReducer((state: any, action: any) => state, {});
  const { isSavingTokens } = tokenQuery;
  const anyIssueHasScope = comicissues.some((comicissue) => comicissue.scopesForExclusiveContent ? comicissue.scopesForExclusiveContent.length > 0 : false);
  const items = new Set<string>(); // TODO: Replace with actual implementation
  const userHasUnlockedEpisodes = items && items.size > 0;

  const listData = useMemo(() => comicissues.map((comicissue, index) => ({
    key: comicissue.uuid,
    type: "issue",
    comicissue,
    comicseries,
    position: index,
  })), [comicissues, comicseries]);

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <ComicIssueDetails
      comicissue={item.comicissue}
      comicseries={item.comicseries}
      position={item.position}
      isCurrentIssue={item.comicissue.uuid === currentIssueUuid}
      imagePriority={index <= 4 ? 'normal' : 'low'}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <ThemedText size="subtitle">{'Episodes'}</ThemedText>
      </View>
      <View style={styles.flashListContainer}>
        <FlashList
          data={listData}
          estimatedItemSize={72}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  flashListContainer: {
    flex: 1,
    width: "100%",
  },
  patreonCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    marginHorizontal: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.icon,
    borderRadius: 16,
  },
  patreonCardTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  patreonCardTextWrapper: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  textStyle: {
    textAlign: "center",
  },
  textStyleMargin: {
    marginBottom: 8
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 100,
  },
}); 