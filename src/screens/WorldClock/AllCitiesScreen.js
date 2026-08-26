import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import SearchInput from '../../components/SearchInput';
import CityListItem from '../../components/CityListItem';
import { searchCitiesInCountry } from '../../data/countriesRepository';
import { colors, fonts, spacing } from '../../theme/theme';

export default function AllCitiesScreen({ navigation, route }) {
  const { cca2, countryName } = route.params;
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchCitiesInCountry(cca2, query), [cca2, query]);

  return (
    <View style={styles.flex}>
      <ScreenHeader title="ALL CITIES" subtitle={countryName} onBack={() => navigation.goBack()} />

      <View style={styles.searchWrap}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search City" />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <CityListItem
            city={item}
            onPress={() =>
              navigation.navigate('CityDetail', { cca2, countryName, city: item })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No cities match "{query}".</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  searchWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingTop: spacing.xxxl,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
});
