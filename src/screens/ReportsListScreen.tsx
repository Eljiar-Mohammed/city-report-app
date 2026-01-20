import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ReportCard, { ReportCardReport } from '../components/ReportCard';
import { supabase } from '../services/supabase';

type ReportRow = ReportCardReport & {
  id?: string | number;
  created_at?: string | null;
};

export default function ReportsListScreen() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();

  const fetchReports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports((data ?? []) as ReportRow[]);
    } catch (e: any) {
      console.log('Fetch reports error:', e);
      Alert.alert('Error', e?.message ?? 'Failed to load reports');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchReports();
      setLoading(false);
    })();
  }, [fetchReports]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }, [fetchReports]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!reports.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No reports yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.listContent}
      data={reports}
      keyExtractor={(item, index) => (item.id ? String(item.id) : String(index))}
      renderItem={({ item }) => (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('ReportDetail', { report: item })}
        >
          <ReportCard report={item} />
        </TouchableOpacity>
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    backgroundColor: '#f6f7fb',
  },
  center: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

