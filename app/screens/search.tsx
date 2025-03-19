import * as React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState, useCallback, useEffect, useReducer } from 'react';

import { Screen, ThemedText, PressableOpacity, ScreenHeader, ThemedActivityIndicator } from '@/app/components/ui';
import { Genre, ComicSeries } from '@/shared/graphql/types';
import { getPrettyGenre } from '@/public/genres';
import { Colors } from '@/constants/Colors';
import { ComicSeriesDetails, ComicSeriesPageType } from '@/app/components/comics/ComicSeriesDetails';
import { publicClient } from '@/lib/apollo';
import { searchQueryReducer, searchInitialState, searchComics, debouncedSearchComics } from '@/shared/dispatch/search';
import { COMICS_LIST_SCREEN } from '@/constants/Navigation';
import { ComicsListPageType } from '@/app/screens/comicslist';

// Popular webtoon tags
const POPULAR_TAGS = [
  'Enemies To Lovers', 'Friends To Lovers', 'Love Triangle', 'Slow Burn', 'Found Family',
  'Revenge Story', 'Fake Dating', 'Contract Marriage', 'Childhood Friends', 'Unrequited Love',
  'Strong Female Lead', 'Villainess', 'Antihero', 'Royalty',
];

// Popular webtoon categories
const POPULAR_CATEGORIES = [
  'COMICSERIES_ACTION', 
  'COMICSERIES_COMEDY',
  'COMICSERIES_ROMANCE',
  'COMICSERIES_THRILLER',
  'COMICSERIES_FANTASY',
  'COMICSERIES_MYSTERY',
  'COMICSERIES_SPORTS',
  'COMICSERIES_DRAMA',
  'COMICSERIES_LGBTQ',
  'COMICSERIES_BL',
  'COMICSERIES_GL',
  'COMICSERIES_ISEKAI',
  'COMICSERIES_DYSTOPIA',
  'COMICSERIES_HAREM',
  'COMICSERIES_HIGH_SCHOOL',
  'COMICSERIES_HORROR',
  'COMICSERIES_POST_APOCALYPTIC',
  'COMICSERIES_SCI_FI',
  'COMICSERIES_SLICE_OF_LIFE',
  'COMICSERIES_SUPERHERO',
  'COMICSERIES_SUPERNATURAL',
  'COMICSERIES_CRIME',
  'COMICSERIES_GAMING',
  'COMICSERIES_EDUCATIONAL',
  'COMICSERIES_HISTORICAL',
  'COMICSERIES_ANIMALS',
  'COMICSERIES_ZOMBIES',
];

// Define item types for FlashList
type ListItem = 
  | { type: 'header' }
  | { type: 'search_bar' }
  | { type: 'tags_section' }
  | { type: 'genres_section' }
  | { type: 'search_results', data: ComicSeries[] }
  | { type: 'load_more' };

const LIMIT_PER_PAGE = 15;
const SEARCH_DEBOUNCE_DELAY = 300; // ms

// Custom hook for search functionality
function useSearch() {
  const [searchText, setSearchText] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Set up the reducer for search state
  const [state, dispatch] = useReducer(searchQueryReducer, searchInitialState);
  const { isSearchLoading, isLoadingMore, searchResults } = state;

  // Reset pagination when search text changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  // Effect to trigger search when search text changes
  useEffect(() => {
    if (searchText.trim().length > 0) {
      // Use the debounced search function that shows loading state immediately
      debouncedSearchComics({
        publicClient,
        term: searchText,
        page: 1, // Always start with page 1 for new searches
        limitPerPage: LIMIT_PER_PAGE,
        filterForTypes: ["COMICSERIES"],
      }, dispatch, SEARCH_DEBOUNCE_DELAY);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchText]);

  // Handle search text change
  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
  }, []);

  // Handle loading more results
  const handleLoadMore = useCallback(() => {
    if (isSearchLoading || isLoadingMore) return;
    
    const nextPage = currentPage + 1;
    
    // For loading more, we can use the regular searchComics function
    // since we want the API call to happen immediately
    searchComics({
      publicClient,
      term: searchText,
      page: nextPage,
      limitPerPage: LIMIT_PER_PAGE,
      filterForTypes: ["COMICSERIES"],
      isLoadingMore: true,
    }, dispatch);
    
    setCurrentPage(nextPage);
  }, [currentPage, searchText, isSearchLoading, isLoadingMore, dispatch]);

  return {
    searchText,
    setSearchText,
    showResults,
    currentPage,
    state,
    isSearchLoading,
    isLoadingMore,
    searchResults,
    handleSearchTextChange,
    handleLoadMore
  };
}

export function SearchScreen() {
  const navigation = useNavigation();
  const { 
    searchText, 
    setSearchText, 
    showResults, 
    currentPage, 
    isSearchLoading, 
    isLoadingMore, 
    searchResults, 
    handleSearchTextChange, 
    handleLoadMore 
  } = useSearch();

  // Handle tag selection
  const handleTagSelect = useCallback((tag: string) => {
    navigation.navigate(COMICS_LIST_SCREEN, {
      pageType: ComicsListPageType.TAG,
      value: tag,
    });
  }, [navigation]);

  // Handle category selection
  const handleCategorySelect = useCallback((category: string) => {
    navigation.navigate(COMICS_LIST_SCREEN, {
      pageType: ComicsListPageType.GENRE,
      value: category,
    });
  }, [navigation]);

  // Data for FlashList
  const getListData = useCallback((): ListItem[] => {
    if (showResults) {
      const items: ListItem[] = [
        { type: 'header' },
        { type: 'search_bar' },
        { type: 'search_results', data: searchResults }
      ];
      
      // Add "Load More" button if needed
      if (isLoadingMore || (!isSearchLoading && searchResults.length > 0 && searchResults.length === LIMIT_PER_PAGE * currentPage)) {
        items.push({ type: 'load_more' });
      }
      
      return items;
    }
    
    return [
      { type: 'header' },
      { type: 'search_bar' },
      { type: 'tags_section' },
      { type: 'genres_section' }
    ];
  }, [showResults, searchResults, isSearchLoading, isLoadingMore, currentPage]);

  // Render item for FlashList
  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    switch (item.type) {
      case 'header':
        return <ScreenHeader additionalTopPadding={0}/>;
      
      case 'search_bar':
        return (
          <SearchBar 
            onSearch={handleSearchTextChange} 
            searchText={searchText} 
            setSearchText={setSearchText}
          />
        );
      
      case 'tags_section':
        return (
          <Section title="Popular Tags">
            <View style={styles.tagsContainer}>
              {POPULAR_TAGS.map((tag) => (
                <SelectableItem 
                  key={tag}
                  label={tag.toLowerCase()}
                  onPress={() => handleTagSelect(tag)}
                  variant="tag"
                />
              ))}
            </View>
          </Section>
        );
      
      case 'genres_section':
        return (
          <Section title="Popular Categories">
            <View style={styles.tagsContainer}>
              {POPULAR_CATEGORIES.map((genre) => (
                <SelectableItem 
                  key={genre}
                  label={getPrettyGenre(genre as Genre)}
                  onPress={() => handleCategorySelect(genre)}
                  variant="category"
                />
              ))}
            </View>
          </Section>
        );
      
      case 'search_results':
        return (
          <SearchResults 
            isLoading={isSearchLoading && currentPage === 1}
            results={searchResults}
            searchText={searchText}
          />
        );
      
      case 'load_more':
        return (
          <LoadMoreButton 
            isLoading={isLoadingMore}
            onPress={handleLoadMore}
          />
        );
      
      default:
        return null;
    }
  }, [
    handleSearchTextChange, 
    handleTagSelect, 
    handleCategorySelect,
    handleLoadMore, 
    isSearchLoading, 
    isLoadingMore,
    searchText, 
    searchResults, 
    currentPage,
  ]);

  return (
    <Screen>
      <View style={styles.container}>
        <FlashList
          data={getListData()}
          renderItem={renderItem}
          estimatedItemSize={300}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </Screen>
  );
}

// Search bar component
interface SearchBarProps {
  onSearch: (text: string) => void;
  searchText: string;
  setSearchText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchText, setSearchText }) => {
  const handleChangeText = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchInputContainer}>
        <FontAwesome5 name="search" size={16} color={Colors.light.text} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for comics"
          placeholderTextColor={Colors.light.text + '80'}
          value={searchText}
          onChangeText={handleChangeText}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <PressableOpacity 
            onPress={() => handleChangeText('')}
            style={styles.clearButton}
          >
            <FontAwesome5 name="times" size={16} color={Colors.light.text} />
          </PressableOpacity>
        )}
      </View>
    </View>
  );
};

// Search Results component
interface SearchResultsProps {
  isLoading: boolean;
  results: ComicSeries[];
  searchText: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ isLoading, results, searchText }) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ThemedActivityIndicator />
      </View>
    );
  }
  
  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>
          No comics found for "{searchText}".
        </ThemedText>
      </View>
    );
  }
  
  return (
    <Section title="Search Results">
      <View style={styles.resultsContainer}>
        {results.map((comicseries) => (
          <ComicSeriesDetails 
            key={comicseries.uuid}
            comicseries={comicseries}
            pageType={ComicSeriesPageType.LIST_ITEM}
          />
        ))}
      </View>
    </Section>
  );
};

// Load More Button component
interface LoadMoreButtonProps {
  isLoading: boolean;
  onPress: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ isLoading, onPress }) => (
  <View style={styles.loadMoreContainer}>
    <PressableOpacity 
      onPress={onPress}
      style={styles.loadMoreButton}
      disabled={isLoading}
    >
      {isLoading 
        ? <ThemedActivityIndicator size='small' /> 
        : <ThemedText style={styles.loadMoreText}>
            Load More
          </ThemedText>
      }
    </PressableOpacity>
  </View>
);

interface SelectableItemProps {
  label: string;
  onPress: () => void;
  variant?: 'tag' | 'category';
}

// Component for selectable genre/tag item
const SelectableItem: React.FC<SelectableItemProps> = ({ label, onPress, variant = 'tag' }) => (
  <PressableOpacity 
    onPress={onPress}
    style={[
      styles.selectableItem,
      variant === 'category' ? styles.categoryItem : styles.tagItem
    ]}
  >
    <ThemedText style={[
      styles.selectableItemText,
      variant === 'category' ? styles.categoryItemText : styles.tagItemText
    ]}>
      {label}
    </ThemedText>
  </PressableOpacity>
);

// Section component for FlashList
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <ThemedText size='subtitle' style={styles.sectionTitle}>
      {title}
    </ThemedText>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectableItem: {
    paddingVertical: 8,
    marginRight: 12,
    marginTop: 6,
    marginBottom: 6,
    borderWidth: 1,
  },
  tagItem: {
    backgroundColor: Colors.light.tint + '20', // Using light tint with opacity
    borderColor: Colors.light.tint + '40',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  categoryItem: {
    backgroundColor: Colors.light.icon + '20', // Using taddy-blue with opacity
    borderColor: Colors.light.icon + '40',
    borderRadius: 8, // More square shape for categories
    paddingHorizontal: 20, // Wider padding
    paddingVertical: 12, // Taller
    marginRight: 14, // Slightly more spacing between items
    marginTop: 8,
    marginBottom: 8,
  },
  selectableItemText: {
    fontSize: 14,
  },
  tagItemText: {
    // Default text style for tags
  },
  categoryItemText: {
    fontSize: 16, // Larger text
    fontWeight: '600', // Bolder text
    letterSpacing: 0.5, // Slightly more spacing between letters
  },
  searchBarContainer: {
    marginBottom: 16,
    marginTop: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.tint + '40',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
  resultsContainer: {
    marginTop: 8,
  },
  loadMoreContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadMoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.light.tint + '20',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.tint + '40',
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
  },
});