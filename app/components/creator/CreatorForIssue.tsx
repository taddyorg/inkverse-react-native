import React, { useMemo, useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Linking } from 'react-native';
import sanitizeHtml from 'sanitize-html';
import RenderHtml, { RenderHTMLProps } from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';

import { ThemedText } from '../ui';
import { CreatorDetails } from './CreatorDetails';
import { Creator, ComicIssue } from '@/shared/graphql/types';
import { useThemeColor } from '@/constants/Colors';
import { BLOG_SCREEN } from '@/constants/Navigation';

interface CreatorForIssueProps {
  creators: Creator[];
  comicissue: ComicIssue;
}

export function CreatorForIssue({ creators, comicissue }: CreatorForIssueProps) {
  const { width } = useWindowDimensions();
  const textColor = useThemeColor({}, 'text');
  const [renderError, setRenderError] = useState(false);
  const navigation = useNavigation();

  const linkColor = useThemeColor({}, 'link');

  
  // Sanitize HTML content with security measures
  const sanitizedCreatorNote = useMemo(() => {
    if (!comicissue.creatorNote) return '';
    
    try {
      // Fix any potential mismatched quotes in links
      let fixedHtml = comicissue.creatorNote
        .replace(/<a\s+href=['"]([^'"]*)['"]\s*>/gi, '<a href="$1">') // Standardize href attributes
        .replace(/<a\s+href=['"]([^'"]*)['"]/gi, '<a href="$1"'); // Fix unclosed quotes
      
      return sanitizeHtml(fixedHtml, {
        allowedTags: ['h1', 'h2', 'h3', 'p', 'a', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'br', 'img'],
        allowedAttributes: {
          a: ['href', 'target'],
          img: ['src', 'alt', 'width', 'height'],
        },
        allowedSchemes: ['https', 'mailto'],
        allowedSchemesByTag: { img: ['https'] },
        transformTags: {
          'a': (tagName, attribs) => {
            if (attribs.href && (attribs.href.startsWith('http') || attribs.href.startsWith('www'))) {
              return {
                tagName,
                attribs: { ...attribs, target: '_blank', rel: 'noopener noreferrer' }
              };
            }
            return { tagName, attribs };
          }
        }
      });
    } catch (error) {
      console.error('HTML sanitization error:', error);
      setRenderError(true);
      return '<p>Unable to display formatted content</p>';
    }
  }, [comicissue.creatorNote]);

  if (renderError) {
    return (
      <View>
        <CreatorsList creators={creators} />
        <View style={styles.creatorNoteContainer}>
          <ThemedText>Error displaying content. Please try again later.</ThemedText>
        </View>
      </View>
    );
  }

  // Handle link presses safely
  const handleLinkPress = (_: any, href: string) => {
    if (href && (href.startsWith('https://') || href.startsWith('http://'))) {
      navigation.navigate(BLOG_SCREEN, { url: href });
    } else if (href && href.startsWith('mailto:')) {
      Linking.openURL(href).catch(err => console.error('Failed to open link:', err));
    }
    return false; // Prevents default behavior
  };

  return (
    <View>
      <CreatorsList creators={creators} />
      
      {comicissue.creatorNote && (
        <View style={styles.creatorNoteContainer}>
          <RenderHtml
            contentWidth={width - 32}
            source={{ html: sanitizedCreatorNote }}
            baseStyle={{ 
              color: textColor, 
              fontSize: 16,
              fontFamily: 'SourceSans3-Regular'
            }}
            tagsStyles={{
              a: { color: linkColor, textDecorationLine: 'none' },
              p: { marginVertical: 8 },
              img: { maxWidth: '100%', height: 'auto' }
            }}
            enableExperimentalBRCollapsing={true}
            enableCSSInlineProcessing={false}
            renderersProps={{
              a: {
                onPress: handleLinkPress
              }
            }}
          />
        </View>
      )}
    </View>
  );
}

// Helper component to reduce duplication
function CreatorsList({ creators }: { creators: Creator[] }) {
  return (
    <View style={styles.creatorContainer}>
      {creators.map((creator: Creator) => (
        <CreatorDetails
          key={creator?.uuid}
          creator={creator}
          pageType='mini-creator'
        /> 
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  creatorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    paddingHorizontal: 6,
  },
  creatorNoteContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  }
}); 