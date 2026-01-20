import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

type Report = {
  title?: string;
  description?: string | null;
  image_url?: string | null;
  address?: string | null;
  created_at?: string | null;
  status?: string | null;
  category?: string | null;
};

type Props = {
  route: any;
};

function getStatusStyles(status?: string | null) {
  const normalized = (status ?? '').toUpperCase();
  if (normalized === 'RESOLVED') return styles.statusResolved;
  if (normalized === 'PENDING') return styles.statusPending;
  if (normalized === 'IN_PROGRESS') return styles.statusInProgress;
  if (normalized === 'REJECTED') return styles.statusRejected;
  return styles.statusDefault;
}

function getStatusLabel(status?: string | null) {
  const normalized = (status ?? '').toUpperCase();
  switch (normalized) {
    case 'PENDING':
      return 'قيد الانتظار';
    case 'IN_PROGRESS':
      return 'جاري الإصلاح';
    case 'RESOLVED':
      return 'تم الحل';
    case 'REJECTED':
      return 'مرفوض';
    default:
      return 'غير معروف';
  }
}

function formatDate(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export default function ReportDetailScreen({ route }: Props) {
  const { report } = route.params as { report: Report };

  const formattedDate = formatDate(report.created_at);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {!!report.image_url && (
        <Image
          source={{ uri: report.image_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.detailsContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{report.title}</Text>
          <View style={styles.headerBadges}>
            {!!report.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{report.category}</Text>
              </View>
            )}
            <View style={[styles.statusBadge, getStatusStyles(report.status)]}>
              <Text style={styles.statusText}>{getStatusLabel(report.status)}</Text>
            </View>
          </View>
        </View>

        {!!formattedDate && (
          <Text style={styles.dateText}>{formattedDate}</Text>
        )}

        {!!report.address && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Location</Text>
            <Text style={styles.sectionText}>📍 {report.address}</Text>
          </View>
        )}

        {!!report.description && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.sectionText}>{report.description}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  content: {
    paddingBottom: 24,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#ddd',
  },
  detailsContainer: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerBadges: {
    alignItems: 'flex-end',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#111',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#eee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  statusPending: {
    backgroundColor: '#FFF4E5',
  },
  statusResolved: {
    backgroundColor: '#E3F8E6',
  },
  statusInProgress: {
    backgroundColor: '#E5F2FF',
  },
  statusRejected: {
    backgroundColor: '#FDE8E8',
  },
  statusDefault: {
    backgroundColor: '#E7EAF0',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#EFEFEF',
  },
  categoryText: {
    fontSize: 11,
    color: '#333',
  },
  dateText: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },
  section: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});

