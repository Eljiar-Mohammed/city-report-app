import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export type ReportStatus = 'PENDING' | 'RESOLVED' | 'IN_PROGRESS' | 'REJECTED' | string;

export type ReportCardReport = {
  title: string;
  description?: string | null;
  image_url?: string | null;
  address?: string | null;
  created_at?: string | null;
  status?: ReportStatus | null;
  category?: string | null;
};

type Props = {
  report: ReportCardReport;
};

function formatDate(value?: string | null) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

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

export default function ReportCard({ report }: Props) {
  return (
    <View style={styles.card}>
      {!!report.image_url && (
        <Image source={{ uri: report.image_url }} style={styles.image} />
      )}

      <View style={styles.body}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={2}>
            {report.title}
          </Text>
          <View style={styles.badgesContainer}>
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

        {!!report.address && (
          <Text style={styles.address} numberOfLines={2}>
            📍 {report.address}
          </Text>
        )}

        {!!report.description && (
          <Text style={styles.description} numberOfLines={3}>
            {report.description}
          </Text>
        )}

        {!!report.created_at && (
          <Text style={styles.meta}>{formatDate(report.created_at)}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#f2f2f2',
  },
  body: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  badgesContainer: {
    alignItems: 'flex-end',
    gap: 6,
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
  address: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  meta: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
  },
});

