import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/constants/Navigation';
import DropDownPicker from 'react-native-dropdown-picker';

import { Screen, ScreenHeader, ThemedView, ThemedText, PressableOpacity, HeaderBackButton, ThemedButton } from '../components/ui';
import { ReportType, getPrettyReportType } from '@/public/report';

export type ReportsScreenParams = {
  uuid: string;
  type: 'comicseries' | 'comicissue' | 'creator';
};

export function ReportsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ReportsScreen'>>();
  const { uuid, type } = route.params || {};
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    Object.values(ReportType).map(reportType => ({
      label: getPrettyReportType(reportType),
      value: reportType
    }))
  );

  const handleSubmitReport = () => {
    if (!selectedReportType) return;
    console.log(selectedReportType);
  };

  return (
    <Screen>
      <View>
        <HeaderBackButton onPress={() => navigation.goBack()} />
      </View>
      <ScreenHeader />
      <ThemedView style={styles.container}>
        {/* Dropdown Selection using react-native-dropdown-picker */}
        <ThemedText size="subtitle" style={styles.headerTitle}>Choose a reason for reporting this content:</ThemedText>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={open}
            value={selectedReportType}
            items={items}
            setOpen={setOpen}
            setValue={setSelectedReportType}
            setItems={setItems}
            maxHeight={300}
            placeholder="Select a reason"
            style={styles.dropdownButton}
            textStyle={styles.dropdownButtonText}
            dropDownContainerStyle={styles.dropdownList}
            listItemContainerStyle={styles.dropdownItem}
            listItemLabelStyle={styles.dropdownItemLabel}
            closeAfterSelecting={true}
            ListEmptyComponent={() => (
              <ThemedText style={styles.emptyListText}>No options available</ThemedText>
            )}
          />
        </View>

        {/* Submit Button */}
        <View style={styles.submitButtonContainer}>
          <ThemedButton
            buttonText="Submit"
            onPress={handleSubmitReport}
            style={[
              styles.submitButton,
              !selectedReportType && styles.disabledButton
            ]}
            disabled={!selectedReportType}
          />
        </View>
      </ThemedView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  dropdownContainer: {
    marginTop: 20,
    zIndex: 1000,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    height: 50,
  },
  dropdownButtonText: {
    fontSize: 16,
    paddingHorizontal: 4,
  },
  dropdownList: {
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    padding: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  dropdownItemLabel: {
    fontSize: 15,
    flexShrink: 1,
    paddingRight: 5,
    flexWrap: 'wrap',
  },
  emptyListText: {
    padding: 12,
    textAlign: 'center',
  },
  submitButtonContainer: {
    marginTop: 25, // Increased to allow space for the dropdown
    alignItems: 'center', // Center the button horizontally
  },
  submitButton: {
    padding: 16,
    paddingHorizontal: 24,
    alignSelf: 'center', // Allow button to size to content
  },
  disabledButton: {
    opacity: 0.5,
  },
}); 