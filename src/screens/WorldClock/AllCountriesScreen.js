import React, { useMemo, useState } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import SearchInput from '../../components/SearchInput';
import CountryListItem from '../../components/CountryListItem';
import { searchCountries } from '../../data/countriesRepository';
import { useNow } from '../../utils/time';
import { colors, fonts, spacing } from '../../theme/theme';

export default function AllCountriesScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const now = useNow(30000); // refresh displayed times every 30s — plenty for a list of clocks

  const results = useMemo(() => searchCountries(query), [query]);

  return (
    <View style={styles.flex}>
      <ScreenHeader title="ALL COUNTRIES" onBack={() => navigation.goBack()} />

      <View style={styles.searchWrap}>
        <SearchInput value={query} onChangeText={setQuery} placeholder="Search Country" />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.cca2}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <CountryListItem
            country={item}
            now={now}
            onPress={() =>
              navigation.navigate('AllCities', { cca2: item.cca2, countryName: item.name })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>No countries match "{query}".</Text>
          </View>
        }
        initialNumToRender={16}
        windowSize={7}
        removeClippedSubviews
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
