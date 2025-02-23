import { View, StyleSheet } from 'react-native'
import React, { useReducer, useMemo } from 'react'
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';

import { Colors } from '@/constants/Colors';
import { ThemedText, ThemedTextSize } from '../ui';
import { ComicIssue, ComicSeries, Creator } from '@/shared/graphql/types';
import { ComicIssueDetails } from './ComicIssueDetails';

// interface PatreonCardTextProps {
//   creator: Creator;
//   comicseries: ComicSeries;
// }

// function getPatreonCardText({ creator, comicseries }: PatreonCardTextProps) {
//   return (
//     <View style={styles.patreonCardTextWrapper}>
//       <ThemedText style={[styles.textStyle, styles.textStyleMargin]} type={ThemedTextStyle.defaultSemiBold}>
//         Yay! Thanks for being a backer of {creator.name}'s comics!
//       </ThemedText>
//       <ThemedText style={styles.textStyle} type={ThemedTextStyle.defaultSemiBold}>
//         You get exclusive access to the most recent {comicseries.name} episodes.
//       </ThemedText>
//     </View>
//   )
// }

export interface ComicIssuesListProps {
  comicissues: ComicIssue[];
  comicseries: ComicSeries;
}

export const ComicIssuesList = (props: ComicIssuesListProps) => {
  const { comicissues, comicseries } = props;

  const [tokenQuery, tokenDispatch] = useReducer((state: any, action: any) => state, {});
  const { isSavingTokens } = tokenQuery;
  const anyIssueHasScope = comicissues.some((comicissue) => comicissue.scopesForExclusiveContent ? comicissue.scopesForExclusiveContent.length > 0 : false);
  const items = new Set<string>(); // TODO: Replace with actual implementation
  const userHasUnlockedEpisodes = items && items.size > 0;
  const creator = comicseries.creators?.[0];

  const listData = useMemo(() => comicissues.map((comicissue, index) => ({
    key: comicissue.uuid,
    type: "issue",
    comicissue,
    comicseries,
    position: index,
  })), [comicissues, comicseries]);

  const renderItem = ({ item }: { item: any }) => (
    <ComicIssueDetails
      comicissue={item.comicissue}
      comicseries={item.comicseries}
      position={item.position}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <ThemedText size={ThemedTextSize.subtitle}>{'Episodes'}</ThemedText>
      </View>
      <View style={styles.flashListContainer}>
        <FlashList
          data={listData}
          contentContainerStyle={styles.flashList}
          estimatedItemSize={72}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
        />
      </View>
      {/* {anyIssueHasScope && userHasUnlockedEpisodes && creator && (
        <View style={styles.patreonCard}>
          <View>
            <Image
              style={styles.avatarImage}
              source={{ uri: creator.avatarImageAsString }}
              contentFit="cover"
            />
          </View>
          <View style={styles.patreonCardTextContainer}>
            {getPatreonCardText({ creator, comicseries })}
          </View>
        </View>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  flashListContainer: {
    flex: 1,
    width: "100%",
  },
  flashList: {
    paddingRight: 16,
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