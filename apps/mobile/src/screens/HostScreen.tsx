import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Image, ActivityIndicator, Alert, Dimensions
} from 'react-native';
import { API_BASE_URL } from '../api/config';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const C = {
  steelBlue: '#8faec8', darkNavy: '#1a2742', midNavy: '#2c3e5e',
  white: '#ffffff', red: '#FF385C', bg: '#f2f4f8',
  green: '#22c55e', amber: '#f59e0b', card: '#ffffff',
};

function StatCard({ icon, label, value, sub, color = C.darkNavy }: any) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <Text style={{ fontSize: 26, marginBottom: 6 }}>{icon}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      {sub ? <Text style={styles.statSub}>{sub}</Text> : null}
    </View>
  );
}

function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>📊 Monthly Bookings vs Previous Month</Text>
      <View style={styles.barGroup}>
        {data.map((d, i) => (
          <View key={i} style={styles.barWrap}>
            <Text style={styles.barVal}>{d.value}</Text>
            <View style={[styles.bar, { height: Math.max(8, (d.value / max) * 100), backgroundColor: i === data.length - 1 ? C.red : C.steelBlue }]} />
            <Text style={styles.barLabel}>{d.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HostScreen({ navigation }: any) {
  const { token, user } = useContext(AuthContext) as any;
  const [properties, setProperties] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<'analytics'|'listings'|'add'>('analytics');

  const [title, setTitle]       = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice]       = useState('');
  const [size, setSize]         = useState('');
  const [features, setFeatures] = useState('');
  const [image, setImage]       = useState('');

  useEffect(() => {
    if (!user) { navigation.goBack(); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [propRes, analRes] = await Promise.all([
        fetch(`${API_BASE_URL}/host/properties`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/host/analytics`,  { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (propRes.ok) { const d = await propRes.json(); setProperties(d.properties || []); }
      if (analRes.ok) { const d = await analRes.json(); setAnalytics(d); }
    } catch (err) {
      console.error('Failed to fetch host data', err);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!title || !price || !location) {
      Alert.alert('Missing fields', 'Title, Price, and Location are required.'); return;
    }
    setSubmitting(true);
    try {
      const safeImage = image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';
      const res = await fetch(`${API_BASE_URL}/host/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title, location, size,
          price: Number(price),
          features: features ? features.split(',').map(f => f.trim()) : [],
          photos: [safeImage]
        }),
      });
      if (res.ok) {
        Alert.alert('✅ Published!', 'Your property is now live in the database.');
        setTitle(''); setLocation(''); setPrice(''); setSize(''); setFeatures(''); setImage('');
        fetchAll();
        setTab('listings');
      } else {
        const d = await res.json();
        Alert.alert('Error', d.message || 'Failed to add property.');
      }
    } catch { Alert.alert('Network error', 'Could not reach server.'); }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/host/properties/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setProperties(prev => prev.filter(p => p.id !== id));
        Alert.alert('Removed', 'Property deleted.');
      }
    } catch { Alert.alert('Error', 'Could not delete.'); }
  };

  // Mock monthly chart data
  const monthlyData = [
    { label: 'Nov', value: analytics?.totalBookings ? Math.max(1, analytics.totalBookings - 5) : 2 },
    { label: 'Dec', value: analytics?.totalBookings ? Math.max(1, analytics.totalBookings - 3) : 4 },
    { label: 'Jan', value: analytics?.totalBookings ? Math.max(1, analytics.totalBookings - 2) : 5 },
    { label: 'Feb', value: analytics?.totalBookings ? Math.max(1, analytics.totalBookings - 1) : 6 },
    { label: 'Mar', value: analytics?.totalBookings ? Math.max(2, analytics.totalBookings) : 7 },
    { label: 'Apr', value: analytics?.totalBookings || 8 },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backTxt}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Host Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['analytics','listings','add'] as const).map(t => (
          <TouchableOpacity key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabTxt, tab === t && styles.tabTxtActive]}>
              {t === 'analytics' ? '📊 Analytics' : t === 'listings' ? '🏠 Listings' : '＋ Add'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ─── ANALYTICS TAB ─── */}
        {tab === 'analytics' && (
          <View>
            {loading ? (
              <ActivityIndicator size="large" color={C.darkNavy} style={{ marginTop: 40 }} />
            ) : (
              <>
                {/* KPI cards */}
                <View style={styles.statsGrid}>
                  <StatCard icon="💰" label="Total Revenue" value={`₹${(analytics?.revenue || 0).toLocaleString()}`} sub="All time" color={C.green} />
                  <StatCard icon="🛎️" label="Bookings" value={analytics?.totalBookings || 0} sub="Confirmed" color={C.red} />
                  <StatCard icon="📈" label="Growth" value={`+${analytics?.growth || 0}%`} sub="vs last month" color={C.amber} />
                  <StatCard icon="🏠" label="Listings" value={properties.length} sub="Active" color={C.steelBlue} />
                </View>

                {/* Bar chart */}
                <View style={styles.card}>
                  <BarChart data={monthlyData} />
                </View>

                {/* Month-over-month comparison */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>📅 Month Comparison</Text>
                  {[
                    { label: 'March 2026', bookings: Math.max(1, (analytics?.totalBookings || 8) - 1), revenue: (analytics?.revenue || 0) * 0.85, highlight: false },
                    { label: 'April 2026', bookings: analytics?.totalBookings || 8, revenue: analytics?.revenue || 0, highlight: true },
                  ].map((m, i) => (
                    <View key={i} style={[styles.compareRow, m.highlight && { backgroundColor: '#fff8f9', borderRadius: 12 }]}>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.compareMonth, m.highlight && { color: C.red }]}>{m.label}</Text>
                        <Text style={styles.compareSub}>{m.bookings} bookings · ₹{Math.round(m.revenue).toLocaleString()} revenue</Text>
                      </View>
                      {m.highlight && <View style={styles.badge}><Text style={styles.badgeTxt}>Current</Text></View>}
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* ─── LISTINGS TAB ─── */}
        {tab === 'listings' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Your Active Listings</Text>
            {loading ? (
              <ActivityIndicator size="large" color={C.darkNavy} style={{ marginTop: 20 }} />
            ) : properties.length === 0 ? (
              <View style={{ alignItems: 'center', padding: 30 }}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>🏠</Text>
                <Text style={{ color: C.steelBlue, textAlign: 'center' }}>No properties yet. Add one from the + tab!</Text>
              </View>
            ) : (
              properties.map(p => {
                let photos: string[] = [];
                try { photos = JSON.parse(p.photos); } catch {}
                const photo = photos[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300';
                return (
                  <View key={p.id} style={styles.listItem}>
                    <Image source={{ uri: photo }} style={styles.listImg} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.listTitle} numberOfLines={1}>{p.title}</Text>
                      <Text style={styles.listLoc}>{p.location}</Text>
                      <Text style={styles.listPrice}>₹{p.price} / night</Text>
                    </View>
                    <TouchableOpacity style={styles.delBtn} onPress={() => handleDelete(p.id)}>
                      <Text style={styles.delTxt}>✕</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* ─── ADD TAB ─── */}
        {tab === 'add' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Add New Property</Text>
            <Text style={styles.instructions}>Publish a new space to the database.</Text>
            {[
              { ph: 'Property Title (e.g. Modern Loft)', val: title, set: setTitle },
              { ph: 'Location (e.g. Jaipur)', val: location, set: setLocation },
              { ph: 'Price per night (₹)', val: price, set: setPrice, num: true },
              { ph: 'Size (e.g. 2 bedrooms, 1 bath)', val: size, set: setSize },
              { ph: 'Features (comma separated: WiFi, Pool)', val: features, set: setFeatures },
              { ph: 'Image URL (optional)', val: image, set: setImage },
            ].map((f, i) => (
              <TextInput key={i} style={styles.input} placeholder={f.ph} value={f.val}
                onChangeText={f.set} keyboardType={f.num ? 'numeric' : 'default'}
                placeholderTextColor={C.steelBlue} />
            ))}
            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd} disabled={submitting}>
              <Text style={styles.submitTxt}>{submitting ? 'Publishing...' : '🚀 Publish Listing'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    paddingTop: 60, paddingBottom: 20, backgroundColor: C.white,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderBottomWidth: 1, borderBottomColor: '#f1f1f1',
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  backTxt: { fontSize: 32, color: C.darkNavy, lineHeight: 34 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: C.darkNavy },
  tabBar: {
    flexDirection: 'row', backgroundColor: C.white,
    borderBottomWidth: 1, borderBottomColor: '#f1f1f1',
  },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: C.red },
  tabTxt: { fontSize: 13, fontWeight: '600', color: C.steelBlue },
  tabTxtActive: { color: C.darkNavy, fontWeight: '800' },
  scroll: { padding: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  statCard: {
    backgroundColor: C.white, borderRadius: 20, padding: 18,
    width: (width - 44) / 2, shadowColor: C.darkNavy,
    shadowOpacity: 0.06, shadowOffset: { width: 0, height: 6 }, shadowRadius: 14, elevation: 3,
  },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 2 },
  statLabel: { fontSize: 13, color: C.darkNavy, fontWeight: '600' },
  statSub: { fontSize: 11, color: C.steelBlue, marginTop: 2 },
  card: {
    backgroundColor: C.white, borderRadius: 24, padding: 20, marginBottom: 16,
    shadowColor: C.darkNavy, shadowOpacity: 0.05, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: C.darkNavy, marginBottom: 16 },
  chartContainer: {},
  chartTitle: { fontSize: 14, fontWeight: '700', color: C.darkNavy, marginBottom: 16 },
  barGroup: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 130 },
  barWrap: { alignItems: 'center', flex: 1 },
  barVal: { fontSize: 11, fontWeight: '700', color: C.darkNavy, marginBottom: 4 },
  bar: { width: 28, borderRadius: 6, minHeight: 8 },
  barLabel: { fontSize: 10, color: C.steelBlue, marginTop: 6 },
  compareRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    paddingHorizontal: 10, marginBottom: 4,
  },
  compareMonth: { fontSize: 15, fontWeight: '700', color: C.darkNavy },
  compareSub: { fontSize: 12, color: C.steelBlue, marginTop: 2 },
  badge: { backgroundColor: '#ffe4e8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeTxt: { color: C.red, fontSize: 11, fontWeight: '800' },
  instructions: { fontSize: 13, color: C.steelBlue, marginBottom: 16 },
  input: {
    backgroundColor: '#f8f9fb', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 12, padding: 14, fontSize: 15, color: C.darkNavy, marginBottom: 12,
  },
  submitBtn: { backgroundColor: C.red, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 6 },
  submitTxt: { color: C.white, fontSize: 16, fontWeight: 'bold' },
  listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f1f1' },
  listImg: { width: 70, height: 70, borderRadius: 12, marginRight: 14 },
  listTitle: { fontSize: 15, fontWeight: 'bold', color: C.darkNavy, marginBottom: 2 },
  listLoc: { fontSize: 12, color: C.steelBlue, marginBottom: 4 },
  listPrice: { fontSize: 13, fontWeight: '700', color: C.midNavy },
  delBtn: { width: 38, height: 38, backgroundColor: '#ffe5e5', borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  delTxt: { color: C.red, fontSize: 16, fontWeight: 'bold' },
});
