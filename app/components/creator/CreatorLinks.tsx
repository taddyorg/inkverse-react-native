import React from 'react';
import { ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { FontAwesome5 } from '@expo/vector-icons';

import { openEmail, openURL } from '@/lib/utils';
import { type LinkDetails, type Maybe, LinkType } from '@/shared/graphql/operations';
import { ColorCategory } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

const linkIcons: Record<LinkType, string> = {
  [LinkType.INSTAGRAM]: "instagram",
  [LinkType.YOUTUBE]: "youtube",
  [LinkType.TIKTOK]: "tiktok",
  [LinkType.EMAIL]: "envelope",
  [LinkType.TWITTER]: "x-3",
  [LinkType.MASTODON]: "mastodon",
  [LinkType.FACEBOOK]: "facebook",
  [LinkType.WEBSITE]: "link",
  [LinkType.MERCH_STORE]: "store",
  [LinkType.TWITCH]: "twitch",
  [LinkType.SNAPCHAT]: "snapchat",
  [LinkType.REDDIT]: "reddit",
  [LinkType.DISCORD]: "discord",
  [LinkType.TELEGRAM]: "telegram",
  [LinkType.PATREON]: "patreon-2",
  [LinkType.PINTEREST]: "pinterest",
  [LinkType.TUMBLR]: "tumblr",
  [LinkType.SPOTIFY]: "spotify",
  [LinkType.SOUNDCLOUD]: "soundcloud",
  [LinkType.BANDCAMP]: "bandcamp",
  [LinkType.VIMEO]: "vimeo",
  [LinkType.WECHAT]: "wechat",
  [LinkType.WHATSAPP]: "whatsapp",
  [LinkType.KO_FI]: "kofi",
  [LinkType.LINKTREE]: "linktree-1",
  [LinkType.ETSY]: "etsy",
};

const alts = [LinkType.EMAIL, LinkType.MERCH_STORE, LinkType.WEBSITE] as const;
const altsSet = new Set<LinkType>(alts);

interface CreatorLinksProps {
  links?: Maybe<Maybe<LinkDetails>[]> | undefined;
  passedInLightColor?: string;
  passedInDarkColor?: string;
}

interface SafeLinkDetails {
  type: LinkType;
  url: string;
}

const svgBaseUrl = 'https://ax0.taddy.org/brands';

export function CreatorLinks({ links, passedInLightColor, passedInDarkColor }: CreatorLinksProps) {
  if (!links || links.length === 0) return null;

  const safeLinks = links.filter((link): link is SafeLinkDetails => 
    link !== null && 
    link.type !== null && 
    link.type !== undefined &&
    link.url !== null && 
    link.url !== undefined
  );

  if (safeLinks.length === 0) return null;
  const color = useThemeColor({ light: passedInLightColor, dark: passedInDarkColor }, ColorCategory.Text);

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.linksContainer}
      contentContainerStyle={styles.linksContentContainer}
    >
      {safeLinks.map((link, index) => {
        const onPress = () => {
          link.type === LinkType.EMAIL ? openEmail({ toAddress: link.url }) : openURL({ url: link.url });
        };

        const iconName = linkIcons[link.type];

        return (
          <TouchableOpacity 
            key={`${link.type}-${link.url}`}
            onPress={onPress}
            style={styles.linkButton}
          >
            {altsSet.has(link.type) 
              ? 
                <FontAwesome5
                  name={iconName}
                  size={24}
                  color={color}
                  style={styles.linkIcon}
                />
              : 
                <SvgUri
                  width={24}
                  height={24}
                  uri={`${svgBaseUrl}/${iconName}.svg`}
                  fill={color}
                  color={color}
                  style={styles.linkIcon}
                />
            }
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linksContainer: {
    width: '100%',
    paddingBottom: 4,
  },
  linksContentContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkButton: {
    marginRight: 16,
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkIcon: {
    opacity: 1,
  },
}); 