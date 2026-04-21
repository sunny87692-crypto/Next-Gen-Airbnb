import React, { useState, useMemo, useEffect } from 'react';
import { 
  SafeAreaView, StyleSheet, Text, View, ScrollView, 
  TouchableOpacity, Image, Dimensions, TextInput
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import ListingDetailScreen from './src/screens/ListingDetailScreen';
import HostScreen from './src/screens/HostScreen';
import AIAgentsScreen from './src/screens/AIAgentsScreen';
import ChatScreen from './src/screens/ChatScreen';
import { AuthProvider, AuthContext, MemoryStorage } from './src/context/AuthContext';
import { API_BASE_URL } from './src/api/config';
// ─── UI TOKENS ───
const { width } = Dimensions.get('window');
const COLORS = {
  lavender: '#d4e4f7',
  cream: '#faf5dc',
  sage: '#d8e9d4',
  steelBlue: '#8faec8',
  darkNavy: '#1a2742',
  midNavy: '#2c3e5e',
  white: '#ffffff',
  background: '#ffffff', // base background to match web bright feel
  pillBg: '#ebebeb',
};

// ─── DATA SOURCES (Copied exactly from Next.js Web) ───

type CategoryId = 'homes' | 'experiences' | 'agents' | 'services';

const categories: { id: CategoryId; icon: string; label: string; badge?: string; aiTag?: boolean }[] = [
  { id: 'homes', icon: '🏠', label: 'Homes' },
  { id: 'experiences', icon: '🧳', label: 'Experiences', badge: 'NEW' },
  { id: 'agents', icon: '🤖', label: 'AI Agents', badge: 'NEW' },
  { id: 'services', icon: '🛎️', label: 'Services', badge: 'NEW', aiTag: true },
];

const homePhotos = [
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1390971284633-8a13fde9d3aa?auto=format&fit=crop&w=900&q=80',
];

const mockSections = [
  {
    id: 'pune',
    title: 'Popular homes in Pune',
    items: [
      { id: 'pn1', title: 'Modern Loft in Koregaon Park', subtitle: 'Designer duplex with terrace', location: 'Pune City', price: '₹8,200 / night', rating: '4.92', badge: 'Guest favourite', category: 'homes', image: homePhotos[0] },
      { id: 'pn2', title: 'Villa in Aundh', subtitle: 'Smart home with pool & garden', location: 'Aundh', price: '₹12,500 / night', rating: '4.87', badge: 'Superhost', category: 'homes', image: homePhotos[1] },
      { id: 'pn3', title: 'Bungalow in Baner', subtitle: 'Quiet neighbourhood, fiber WiFi', location: 'Baner', price: '₹6,900 / night', rating: '4.78', badge: 'Top rated', category: 'homes', image: homePhotos[2] },
      { id: 'pn4', title: 'Penthouse in Viman Nagar', subtitle: 'Sky view, rooftop terrace', location: 'Viman Nagar', price: '₹15,000 / night', rating: '4.96', badge: 'Luxury pick', category: 'homes', image: homePhotos[3] },
      { id: 'pn5', title: 'Farmhouse in Lavasa', subtitle: 'Hill retreat, 40 min from Pune', location: 'Lavasa', price: '₹18,000 / night', rating: '4.95', badge: 'Rare find', category: 'homes', image: homePhotos[4] },
      { id: 'pn-exp', title: 'Prototype Weekend', subtitle: 'Live founder retreat', location: 'Pimpri-Chinchwad', price: '₹6,768 / session', rating: '4.98', badge: 'Creator pick', category: 'experiences', image: homePhotos[8] },
      { id: 'pn-agent', title: 'Prompt Pilot Agent', subtitle: 'Booking assistant for smart flows', location: 'Pune City', price: '₹8,559 setup', rating: '4.96', badge: 'Agent ready', category: 'agents', image: homePhotos[9] },
      { id: 'pn-svc', title: 'AI Concierge Setup', subtitle: 'Custom itinerary + check-in flow', location: 'Pune City', price: '₹20,083 package', rating: '4.86', badge: 'Hot right now', category: 'services', image: homePhotos[0] },
    ],
  },
  {
    id: 'goa',
    title: 'Available in North Goa this weekend',
    items: [
      { id: 'ga1', title: 'Beach House in Calangute', subtitle: 'Seconds from the shore', location: 'Calangute', price: '₹11,000 / night', rating: '4.93', badge: 'Beachfront', category: 'homes', image: homePhotos[1] },
      { id: 'ga2', title: 'Villa in Siolim', subtitle: 'Infinity pool + sunset views', location: 'Siolim', price: '₹24,000 / night', rating: '4.97', badge: 'Guest favourite', category: 'homes', image: homePhotos[2] },
      { id: 'ga3', title: 'Treehouse in Assagao', subtitle: 'Canopy living with hammock porch', location: 'Assagao', price: '₹9,200 / night', rating: '4.88', badge: 'Unique stay', category: 'homes', image: homePhotos[3] },
      { id: 'ga4', title: 'Shack Villa in Morjim', subtitle: 'Turtle beach front', location: 'Morjim', price: '₹14,300 / night', rating: '4.90', badge: 'Eco stay', category: 'homes', image: homePhotos[4] },
      { id: 'ga-exp', title: 'Goa Build Retreat', subtitle: 'Open lounge for team sessions', location: 'Goa', price: '₹10,728 / retreat', rating: '4.98', badge: 'Team ready', category: 'experiences', image: homePhotos[9] },
      { id: 'ga-agent', title: 'Host Brain Agent', subtitle: 'Automated guest responses', location: 'Candolim', price: '₹11,712 bundle', rating: '4.91', badge: 'Best seller', category: 'agents', image: homePhotos[0] },
      { id: 'ga-svc', title: 'Host Automation Service', subtitle: 'Sprint planning + automations', location: 'Candolim', price: '₹12,437 bundle', rating: '4.84', badge: 'Top host', category: 'services', image: homePhotos[1] },
    ],
  },
  {
    id: 'mumbai',
    title: 'Weekend escapes near Mumbai',
    items: [
      { id: 'mb1', title: 'Sea-view Flat in Bandra', subtitle: 'Steps from Bandstand promenade', location: 'Bandra West', price: '₹13,500 / night', rating: '4.89', badge: 'Sea view', category: 'homes', image: homePhotos[2] },
      { id: 'mb2', title: 'Penthouse in Juhu', subtitle: 'Beach & Bollywood vibes', location: 'Juhu', price: '₹28,000 / night', rating: '4.96', badge: 'VIP pick', category: 'homes', image: homePhotos[3] },
      { id: 'mb3', title: 'Cottage in Alibaug', subtitle: 'Island escape, ferry ride from Gateway', location: 'Alibaug', price: '₹9,800 / night', rating: '4.82', badge: 'Island life', category: 'homes', image: homePhotos[4] },
      { id: 'mb4', title: 'Bungalow in Mahabaleshwar', subtitle: 'Strawberry valley panorama', location: 'Mahabaleshwar', price: '₹11,500 / night', rating: '4.85', badge: 'Scenic beauty', category: 'homes', image: homePhotos[5] },
      { id: 'mb-exp', title: 'Mumbai Street Food Tour', subtitle: 'AI-curated local food trail', location: 'South Mumbai', price: '₹2,499 / person', rating: '4.97', badge: 'Foodie pick', category: 'experiences', image: homePhotos[0] },
      { id: 'mb-agent', title: 'City Navigator Agent', subtitle: 'Real-time local recommendations', location: 'Mumbai', price: '₹6,200 setup', rating: '4.88', badge: 'City guide', category: 'agents', image: homePhotos[1] },
    ],
  },
  {
    id: 'bangalore',
    title: 'Tech-friendly stays in Bangalore',
    items: [
      { id: 'bl1', title: 'Loft in Indiranagar', subtitle: 'Indie cafes at your doorstep', location: 'Indiranagar', price: '₹7,200 / night', rating: '4.88', badge: 'Creator fav', category: 'homes', image: homePhotos[3] },
      { id: 'bl2', title: 'Villa in Whitefield', subtitle: 'Gated community, 4BHK pool home', location: 'Whitefield', price: '₹18,500 / night', rating: '4.93', badge: 'Tech enclave', category: 'homes', image: homePhotos[4] },
      { id: 'bl3', title: 'Apartment in Koramangala', subtitle: 'Startup hub, coworking nearby', location: 'Koramangala', price: '₹5,900 / night', rating: '4.75', badge: 'Work-friendly', category: 'homes', image: homePhotos[5] },
      { id: 'bl4', title: 'Farmstay in Chikmagalur', subtitle: 'Coffee estate bungalow', location: 'Chikmagalur', price: '₹14,000 / night', rating: '4.94', badge: 'Brew retreat', category: 'homes', image: homePhotos[6] },
      { id: 'bl-exp', title: 'Bangalore Brew Trail', subtitle: 'Craft beer + local eats tour', location: 'CBR Road', price: '₹3,200 / person', rating: '4.89', badge: 'Social fix', category: 'experiences', image: homePhotos[1] },
      { id: 'bl-agent', title: 'Startup Scout Agent', subtitle: 'Co-working space finder', location: 'Bangalore', price: '₹9,500 setup', rating: '4.93', badge: 'Builder pick', category: 'agents', image: homePhotos[2] },
    ],
  },
  {
    id: 'jaipur',
    title: 'Heritage stays in Jaipur 🏰',
    items: [
      { id: 'jp1', title: 'Heritage Haveli in Pink City', subtitle: 'Royal stay with traditional artisan decor', location: 'Jaipur', price: '₹9,000 / night', rating: '4.96', badge: 'Heritage gem', category: 'homes', image: homePhotos[7] },
      { id: 'jp2', title: 'Palace Villa in Amer', subtitle: 'Overlooking the Amber Fort', location: 'Amer', price: '₹22,000 / night', rating: '4.99', badge: 'Royal pick', category: 'homes', image: homePhotos[8] },
      { id: 'jp3', title: 'Boutique Hotel in C-Scheme', subtitle: 'Modern luxury in Jaipur heart', location: 'C-Scheme', price: '₹7,500 / night', rating: '4.80', badge: 'City central', category: 'homes', image: homePhotos[9] },
      { id: 'jp-exp', title: 'Rajasthan Desert Camp', subtitle: 'Camel safari + stargazing night', location: 'Jaisalmer', price: '₹12,500 / night', rating: '4.97', badge: 'Desert magic', category: 'experiences', image: homePhotos[0] },
    ],
  },
  {
    id: 'delhi',
    title: 'Capital stays in New Delhi 🏛️',
    items: [
      { id: 'dl1', title: 'Penthouse in Vasant Vihar', subtitle: 'Diplomatic enclave luxury', location: 'Vasant Vihar', price: '₹18,000 / night', rating: '4.93', badge: 'Diplomat fav', category: 'homes', image: homePhotos[1] },
      { id: 'dl2', title: 'Apartment in Hauz Khas', subtitle: 'Trendy village, rooftop cafes', location: 'Hauz Khas', price: '₹8,500 / night', rating: '4.86', badge: 'Artsy quarter', category: 'homes', image: homePhotos[2] },
      { id: 'dl3', title: 'Bungalow in Mehrauli', subtitle: 'Near Qutub Minar, garden retreat', location: 'Mehrauli', price: '₹11,000 / night', rating: '4.88', badge: 'History & calm', category: 'homes', image: homePhotos[3] },
      { id: 'dl4', title: 'Flat in Saket', subtitle: 'South Delhi, malls and metro nearby', location: 'Saket', price: '₹5,200 / night', rating: '4.70', badge: 'Value pick', category: 'homes', image: homePhotos[4] },
      { id: 'dl-exp', title: 'Delhi Food Walk', subtitle: 'Chandni Chowk street food trail', location: 'Old Delhi', price: '₹1,999 / person', rating: '4.96', badge: 'Foodie pick', category: 'experiences', image: homePhotos[5] },
    ],
  },
  {
    id: 'kerala',
    title: 'Backwater bliss in Kerala 🌴',
    items: [
      { id: 'kl1', title: 'Houseboat on Vembanad Lake', subtitle: 'Private houseboat with chef', location: 'Alleppey', price: '₹16,000 / night', rating: '4.98', badge: 'Top in Kerala', category: 'homes', image: homePhotos[6] },
      { id: 'kl2', title: 'Treehouse in Wayanad', subtitle: 'Deep in spice forest canopy', location: 'Wayanad', price: '₹8,800 / night', rating: '4.91', badge: 'Eco retreat', category: 'homes', image: homePhotos[7] },
      { id: 'kl3', title: 'Beach Villa in Varkala', subtitle: 'Cliff-top sea facing', location: 'Varkala', price: '₹10,200 / night', rating: '4.89', badge: 'Clifftop gem', category: 'homes', image: homePhotos[8] },
      { id: 'kl4', title: 'Tea Estate Bungalow', subtitle: 'Colonial hill stay in Munnar', location: 'Munnar', price: '₹13,500 / night', rating: '4.95', badge: 'Misty hills', category: 'homes', image: homePhotos[9] },
      { id: 'kl-exp', title: 'Ayurveda Retreat', subtitle: 'Panchakarma + yoga package', location: 'Thrissur', price: '₹9,500 / retreat', rating: '4.99', badge: 'Wellness pick', category: 'experiences', image: homePhotos[0] },
    ],
  },
  {
    id: 'srinagar',
    title: 'Paradise stays in Kashmir 🏔️',
    items: [
      { id: 'sr1', title: 'Houseboat on Dal Lake', subtitle: 'Peaceful stay on water, mountain views', location: 'Srinagar', price: '₹15,000 / night', rating: '4.97', badge: 'Kashmir pick', category: 'homes', image: homePhotos[1] },
      { id: 'sr2', title: 'Cottage in Pahalgam', subtitle: 'Valley of Shepherds retreat', location: 'Pahalgam', price: '₹12,000 / night', rating: '4.92', badge: 'Valley life', category: 'homes', image: homePhotos[2] },
      { id: 'sr3', title: 'Apple Orchard Stay', subtitle: 'Seasonal harvest bungalow', location: 'Shopian', price: '₹7,800 / night', rating: '4.85', badge: 'Orchard stay', category: 'homes', image: homePhotos[3] },
      { id: 'sr-exp', title: 'Gulmarg Ski Weekend', subtitle: 'Ski packages with gondola access', location: 'Gulmarg', price: '₹22,000 / package', rating: '4.98', badge: 'Snow sports', category: 'experiences', image: homePhotos[4] },
    ],
  },
  {
    id: 'manali',
    title: 'Mountain retreats in Himachal 🌨️',
    items: [
      { id: 'mn1', title: 'Himalayan Cabin Stay', subtitle: 'Cozy wooden cabin near Rohtang Pass', location: 'Manali', price: '₹6,800 / night', rating: '4.90', badge: 'Mountain gem', category: 'homes', image: homePhotos[5] },
      { id: 'mn2', title: 'Riverside Cottage in Kasol', subtitle: 'Parvati river views, pine forest', location: 'Kasol', price: '₹4,500 / night', rating: '4.82', badge: 'Backpacker fav', category: 'homes', image: homePhotos[6] },
      { id: 'mn3', title: 'Chalet in Kufri', subtitle: 'Snow-capped views, Shimla nearby', location: 'Kufri', price: '₹9,400 / night', rating: '4.88', badge: 'Snow retreat', category: 'homes', image: homePhotos[7] },
      { id: 'mn4', title: 'Dharamshala Homestay', subtitle: 'Tibetan culture, Dalai Lama quarter', location: 'Dharamshala', price: '₹5,600 / night', rating: '4.86', badge: 'Spiritual stay', category: 'homes', image: homePhotos[8] },
      { id: 'mn-exp', title: 'Spiti Valley Expedition', subtitle: 'Off-road adventure + camping', location: 'Spiti', price: '₹18,000 / trip', rating: '4.99', badge: 'Epic adventure', category: 'experiences', image: homePhotos[9] },
    ],
  },
];

// ─── SCREENS ───

const ExploreScreen = ({ navigation }: any) => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('homes');
  const [searchWhere, setSearchWhere] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [liveSections, setLiveSections] = useState<any[]>(mockSections);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/listings`);
        if (res.ok) {
          const data = await res.json();
          if (data.listings && data.listings.length > 0) {
            // Group fetched listings into an "All Listings" section dynamically
            setLiveSections([
              {
                id: 'live',
                title: 'Available across India',
                items: data.listings.map((item: any) => ({
                  id: item.id,
                  title: item.title,
                  subtitle: item.description || item.size,
                  location: item.location,
                  price: `₹${item.price} / night`,
                  rating: '4.95', // Placeholder for DB without avg review rating logic yet
                  badge: 'Guest favourite',
                  category: 'homes',
                  image: (item.photos && item.photos[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'
                }))
              },
              ...mockSections // Keep mock sections as fallback/supplements
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      }
    };
    fetchListings();
  }, []);

  // Filter sections by search intent and active category
  const filteredSections = useMemo(() => {
    const w = searchWhere.trim().toLowerCase();
    return liveSections.map(s => ({
      ...s,
      items: s.items.filter(item => {
        const catOk = item.category === activeCategory;
        const whereOk = !w || 
          item.title.toLowerCase().includes(w) || 
          item.subtitle.toLowerCase().includes(w) || 
          item.location.toLowerCase().includes(w);
        return catOk && whereOk;
      }),
    })).filter(s => s.items.length > 0);
  }, [activeCategory, searchWhere]);

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      
      {/* ── HEADER ── */}
      <View style={styles.header}>
        {/* Logo block */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🏠</Text>
          <Text style={styles.logoText}>next-gen ai</Text>
        </View>

        {/* Search Bar pill */}
        <View style={styles.searchBar}>
          <Text style={{ fontSize: 18, color: COLORS.darkNavy, marginRight: 10 }}>🔍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.searchLabel}>Where to?</Text>
            <TextInput 
              style={styles.searchInput}
              placeholder="Search destinations"
              value={searchWhere}
              onChangeText={setSearchWhere}
              placeholderTextColor={COLORS.steelBlue}
            />
          </View>
        </View>

        {/* Categories strip */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat, idx) => {
            const isActive = cat.id === activeCategory;
            return (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => setActiveCategory(cat.id)}
                style={[styles.categoryBtn, isActive && styles.categoryBtnActive, idx === 0 && { marginLeft: 20 }, idx === categories.length -1 && { marginRight: 20 }]}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <View style={{ alignItems: 'center' }}>
                  {cat.badge && <Text style={styles.catBadgeText}>{cat.badge}</Text>}
                  <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>{cat.label}</Text>
                </View>
                {cat.aiTag && (
                  <View style={styles.aiTag}>
                    <Text style={{ fontSize: 8 }}>🤖</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── LISTINGS ── */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {filteredSections.length > 0 ? (
          filteredSections.map(section => (
            <View key={section.id} style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={width * 0.75 + 16} decelerationRate="fast">
                {section.items.map((item, idx) => (
                  <TouchableOpacity key={item.id} style={[styles.card, idx === 0 && { marginLeft: 20 }, idx === section.items.length - 1 && { marginRight: 20 }]} onPress={() => navigation.navigate('ListingDetail', { item })}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
                      <View style={styles.overlay} />
                      
                      {/* Image top badges */}
                      <View style={styles.cardTopStrip}>
                        <View style={styles.cardBadge}>
                          <Text style={styles.cardBadgeLabel}>{item.badge}</Text>
                        </View>
                        <TouchableOpacity style={styles.heartBtn} onPress={() => toggleFav(item.id)}>
                          <Text style={{ fontSize: 18, color: favorites.has(item.id) ? '#FF385C' : '#fff' }}>
                            {favorites.has(item.id) ? '♥' : '♡'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    
                    {/* Card details */}
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                      <Text style={styles.cardSub} numberOfLines={1}>{item.subtitle}</Text>
                      <Text style={styles.cardLoc}>{item.location}</Text>
                      
                      <View style={styles.cardFooter}>
                        <Text style={styles.cardPrice}>{item.price}</Text>
                        <Text style={styles.cardRating}>★ {item.rating}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 50, marginBottom: 15 }}>🔍</Text>
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptySubtitle}>Try a different category or clear search.</Text>
            <TouchableOpacity onPress={() => setSearchWhere('')} style={styles.clearBtn}>
              <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>Clear search</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const WishlistScreen = () => (
  <View style={styles.centerScreen}>
    <Text style={styles.iconBig}>❤️</Text>
    <Text style={styles.emptyScreenTitle}>Your wishlist is empty</Text>
    <Text style={styles.emptyScreenSubtitle}>Tap the heart on any property to save it here.</Text>
  </View>
);

const ProfileScreen = ({ navigation }: any) => {
  const { user, setUser, setToken, logout } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    try {
      const url = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;
      const body = isLogin ? { email, password } : { email, password, name };
      
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Auth failed');
      
      if (!isLogin) {
        setIsLogin(true);
        setError('Registered! Please login.');
        return;
      }
      
      await MemoryStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (user) {
    return (
      <View style={styles.centerScreen}>
        <View style={styles.profileAvatar}>
          <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}</Text>
        </View>
        <Text style={styles.emptyScreenTitle}>Welcome, {user.name || 'Traveler'}</Text>
        <Text style={{color: COLORS.steelBlue, marginBottom: 30}}>{user.email}</Text>
        
        <View style={styles.menuList}>
          <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>Account Settings</Text>
              <Text style={{ color: '#ccc', fontSize: 20 }}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Host')}>
              <Text style={styles.menuItemText}>Become a Host</Text>
              <Text style={{ color: '#ccc', fontSize: 20 }}>›</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={[styles.loginBtn, {backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.darkNavy, marginTop: 40}]} onPress={logout}>
          <Text style={[styles.loginBtnText, {color: COLORS.darkNavy}]}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.centerScreen, {justifyContent: 'flex-start', paddingTop: 80}]}>
      <Text style={styles.emptyScreenTitle}>{isLogin ? 'Log in to Next-Gen' : 'Create an account'}</Text>
      
      {error ? <Text style={{color: 'red', marginTop: 10, textAlign: 'center'}}>{error}</Text> : null}

      <View style={{width: '100%', marginTop: 30, gap: 15}}>
        {!isLogin && (
          <TextInput 
            style={styles.inputField} 
            placeholder="Full Name" 
            value={name} onChangeText={setName} 
            placeholderTextColor={COLORS.steelBlue}
          />
        )}
        <TextInput 
          style={styles.inputField} 
          placeholder="Email address" 
          keyboardType="email-address"
          autoCapitalize="none"
          value={email} onChangeText={setEmail} 
          placeholderTextColor={COLORS.steelBlue}
        />
        <TextInput 
          style={styles.inputField} 
          placeholder="Password" 
          secureTextEntry
          value={password} onChangeText={setPassword} 
          placeholderTextColor={COLORS.steelBlue}
        />
      </View>

      <TouchableOpacity style={styles.loginBtn} onPress={handleAuth}>
        <Text style={styles.loginBtnText}>{isLogin ? 'Continue' : 'Sign up'}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={{marginTop: 25}}>
        <Text style={{color: COLORS.darkNavy, fontWeight: 'bold', textDecorationLine: 'underline'}}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── MAIN NAV ───

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.darkNavy,
          tabBarInactiveTintColor: COLORS.steelBlue,
          tabBarStyle: {
            height: 90,
            paddingBottom: 30,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#f1f1f1',
            elevation: 0,
            backgroundColor: COLORS.white,
          },
          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
          }
        }}
      >
        <Tab.Screen 
          name="Explore" 
          component={ExploreScreen} 
          options={{ tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 24 }}>🌏</Text> }}
        />
        <Tab.Screen 
          name="Agents" 
          component={AIAgentsScreen} 
          options={{ tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 24 }}>🤖</Text> }}
        />
        <Tab.Screen 
          name="Wishlists" 
          component={WishlistScreen} 
          options={{ tabBarIcon: ({ color }: { color: string }) => <Text style={{ color, fontSize: 24 }}>♡</Text> }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ tabBarIcon: function ProfileIcon({ color }) { 
            const { user } = React.useContext(AuthContext);
            if (user) {
              return (
                 <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.darkNavy, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: COLORS.white, fontSize: 14, fontWeight: '900' }}>
                       {user.email[0].toUpperCase()}
                    </Text>
                 </View>
              );
            }
            return <Text style={{ color, fontSize: 24 }}>👤</Text>;
          } }}
        />
      </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
           <Stack.Screen name="MainTabs" component={MainTabs} />
           <Stack.Screen name="ListingDetail" component={ListingDetailScreen} />
           <Stack.Screen name="Host" component={HostScreen} />
           <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

// ─── STYLES ───

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.background,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(143, 174, 200, 0.2)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginBottom: 15,
  },
  logoIcon: {
    color: '#FF385C',
    fontSize: 24,
    marginRight: 6,
  },
  logoText: {
    color: '#FF385C',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: COLORS.darkNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(143, 174, 200, 0.1)',
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.darkNavy,
  },
  searchInput: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkNavy,
    padding: 0,
    marginTop: 2,
    height: 20,
  },
  categoryScroll: {
    marginTop: 20,
    paddingBottom: 15,
  },
  categoryBtn: {
    alignItems: 'center',
    marginRight: 28,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    paddingBottom: 8,
    position: 'relative',
  },
  categoryBtnActive: {
    borderBottomColor: COLORS.darkNavy,
  },
  catIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  catBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    backgroundColor: COLORS.darkNavy,
    color: COLORS.white,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 2,
  },
  aiTag: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.steelBlue,
  },
  categoryTextActive: {
    color: COLORS.darkNavy,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 80,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.darkNavy,
    marginLeft: 20,
    marginBottom: 16,
  },
  card: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.darkNavy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    paddingBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  cardTopStrip: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cardBadgeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.darkNavy,
  },
  heartBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 16,
    paddingBottom: 0,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.darkNavy,
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 13,
    color: COLORS.steelBlue,
    marginBottom: 2,
  },
  cardLoc: {
    fontSize: 12,
    color: COLORS.steelBlue,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkNavy,
  },
  cardRating: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.darkNavy,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.darkNavy,
  },
  emptySubtitle: {
    fontSize: 15,
    color: COLORS.steelBlue,
    marginTop: 8,
    marginBottom: 20,
  },
  clearBtn: {
    backgroundColor: COLORS.darkNavy,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  centerScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 24,
  },
  iconBig: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyScreenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.darkNavy,
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyScreenSubtitle: {
    fontSize: 16,
    color: COLORS.steelBlue,
    textAlign: 'center',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.darkNavy,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 40,
    fontWeight: 'bold',
  },
  loginBtn: {
    backgroundColor: '#FF385C',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  loginBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '800',
  },
  menuList: {
    width: '100%',
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.darkNavy,
    fontWeight: '600',
  },
  inputField: {
    width: '100%',
    padding: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    fontSize: 16,
    color: COLORS.darkNavy,
  }
});
