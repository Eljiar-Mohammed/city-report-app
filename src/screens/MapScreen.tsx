import React, { useCallback, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, Text } from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../services/supabase';

type MapReport = {
  id?: string | number;
  title: string;
  latitude?: number | null;
  longitude?: number | null;
};

const INITIAL_REGION: Region = {
  latitude: 34.68,
  longitude: -1.91,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};

export default function MapScreen() {
  const [reports, setReports] = useState<MapReport[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();

  const fetchReports = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports((data ?? []) as MapReport[]);
    } catch (e: any) {
      console.log('Fetch reports for map error:', e);
      Alert.alert('Error', e?.message ?? 'Failed to load reports for map');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchReports();
      setLoading(false);
    })();
  }, [fetchReports]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <MapView style={styles.map} initialRegion={INITIAL_REGION}>
      {reports
        .filter(
          (r) =>
            typeof r.latitude === 'number' &&
            typeof r.longitude === 'number' &&
            r.latitude !== null &&
            r.longitude !== null,
        )
        .map((report) => (
          <Marker
            key={String(report.id ?? `${report.latitude}-${report.longitude}`)}
            coordinate={{ latitude: report.latitude as number, longitude: report.longitude as number }}
            onCalloutPress={() => navigation.navigate('ReportDetail', { report })}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{report.title}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  callout: {
    maxWidth: 200,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
});

