import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const COLORS = {
  lavender: '#d4e4f7',
  cream: '#faf5dc',
  sage: '#d8e9d4',
  steelBlue: '#8faec8',
  darkNavy: '#1a2742',
  white: '#ffffff',
  background: '#f2f4f8'
};

const MAIN_AGENT = {
  id: 'trip-planner',
  name: 'Trip Planner',
  icon: '🧳',
  description: 'Your personal AI concierge. Tell me where you want to go, and I will find homes, plan itineraries, and suggest top experiences in India.',
  isNew: false
};

const OTHER_AGENTS = [
  { id: 'host-buddy', name: 'Host Brain', icon: '🏠', description: 'Automates responses and manages pricing for hosts.' },
  { id: 'city-guide', name: 'City Navigator', icon: '📍', description: 'Real-time local recommendations and transit info.' }
];

export default function AIAgentsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerLogo}>✨</Text>
          <Text style={styles.headerTitle}>AI Agents</Text>
        </View>
        <Text style={styles.headerSubtitle}>Intelligent assistants powered by Claude</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Featured Agent Card */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredGradient} />
          <View style={styles.cardHeader}>
            <View style={styles.iconContainer}>
              <Text style={styles.agentIcon}>{MAIN_AGENT.icon}</Text>
            </View>
            <View style={styles.agentBadge}>
              <Text style={styles.agentBadgeText}>Gemini-style</Text>
            </View>
          </View>
          
          <Text style={styles.agentName}>{MAIN_AGENT.name}</Text>
          <Text style={styles.agentDescription}>{MAIN_AGENT.description}</Text>
          
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => navigation.navigate('Chat', { agent: MAIN_AGENT })}
            activeOpacity={0.8}
          >
            <Text style={styles.chatButtonText}>Chat with Agent</Text>
            <Text style={styles.chatButtonIcon}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Other Agents */}
        <Text style={styles.sectionTitle}>More Agents</Text>
        {OTHER_AGENTS.map(agent => (
          <TouchableOpacity key={agent.id} style={styles.smallCard} activeOpacity={0.7} onPress={() => {}}>
            <View style={[styles.iconContainer, { width: 50, height: 50 }]}>
              <Text style={{ fontSize: 24 }}>{agent.icon}</Text>
            </View>
            <View style={styles.smallCardContent}>
              <Text style={styles.smallCardTitle}>{agent.name}</Text>
              <Text style={styles.smallCardDesc} numberOfLines={2}>{agent.description}</Text>
            </View>
            <Text style={{ color: COLORS.steelBlue, fontSize: 20 }}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLogo: {
    fontSize: 28,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.darkNavy,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.steelBlue,
    fontWeight: '500',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  featuredCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 24,
    shadowColor: COLORS.darkNavy,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    marginBottom: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: COLORS.lavender,
    opacity: 0.3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  agentIcon: {
    fontSize: 32,
  },
  agentBadge: {
    backgroundColor: COLORS.darkNavy,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  agentBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  agentName: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.darkNavy,
    marginBottom: 12,
  },
  agentDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.midNavy,
    opacity: 0.8,
    marginBottom: 24,
  },
  chatButton: {
    backgroundColor: COLORS.darkNavy,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  chatButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  chatButtonIcon: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.darkNavy,
    marginBottom: 16,
  },
  smallCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: COLORS.darkNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  smallCardContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  smallCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkNavy,
    marginBottom: 4,
  },
  smallCardDesc: {
    fontSize: 13,
    color: COLORS.steelBlue,
  }
});
