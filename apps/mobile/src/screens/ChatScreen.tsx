import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, 
  SafeAreaView, KeyboardAvoidingView, Platform, Image, ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { CLAUDE_API_KEY } from '../api/keys';
import { API_BASE_URL } from '../api/config';

// Theme tokens mirroring the website
const COLORS = {
  lavender: '#d4e4f7',
  sage: '#d8e9d4',
  steelBlue: '#8faec8',
  darkNavy: '#1a2742',
  midNavy: '#2c3e5e',
  white: '#ffffff',
  background: '#f2f4f8',
  chatbotBg: '#f8f9fa'
};

type Role = 'user' | 'assistant';

type Message = {
  id: string;
  role: Role;
  text: string;
  cards?: any[];
};

export default function ChatScreen({ route, navigation }: any) {
  const agent = route.params?.agent || { name: 'Trip Planner', icon: '🧳' };
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 'msg-0', role: 'assistant', text: `Hi! I'm your ${agent.name}. Where would you like to travel in India?` }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const fetchListings = async (query: any) => {
    try {
      const locationMatch = query.location ? query.location.toLowerCase() : '';
      const response = await fetch(`${API_BASE_URL}/listings`);
      if (!response.ok) throw new Error('API down');
      const data = await response.json();
      
      let results = data.listings || [];
      if (locationMatch) {
         results = results.filter((item: any) => 
           item.location?.toLowerCase().includes(locationMatch) || 
           item.title?.toLowerCase().includes(locationMatch)
         );
      }
      return results.slice(0, 3);
    } catch (e) {
      console.log('Falling back to local mock data for agent', e);
      // Fallback dummy data modeled after App.tsx mockSections
      const fallbackListings = [
        { id: 'f1', title: `Smart Home in ${query.location || 'India'}`, price: 8500, location: query.location || 'India', photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'] },
        { id: 'f2', title: `Luxury Villa in ${query.location || 'India'}`, price: 15000, location: query.location || 'India', photos: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600'] }
      ];
      return fallbackListings;
    }
  };

  const callClaude = async (userText: string) => {
    if (!CLAUDE_API_KEY) {
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'assistant', 
          text: 'API Key is missing. Please add your CLAUDE_API_KEY in apps/mobile/src/api/keys.ts to enable my brain!' 
        }]);
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      // Build conversation history for Claude API payload
      const history = messages.map(m => ({
        role: m.role,
        content: m.text
      }));
      history.push({ role: 'user', content: userText });

      const requestBody = {
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        system: "You are a trip planning agent for an Indian travel app. Help users find homes, plan itineraries, and suggest experiences across India. You have access to a tool called search_listings. Use it whenever the user is asking for homes or stays in a particular location or city. Otherwise, provide helpful advice, itineraries, or packing lists. Keep your responses concise and friendly.",
        messages: history,
        tools: [
          {
            name: "search_listings",
            description: "Search for available homes, stays, or properties by location.",
            input_schema: {
              type: "object",
              properties: {
                location: { type: "string", description: "The city or neighbourhood in India (e.g., Pune, Goa, Mumbai)." },
                budget: { type: "string", description: "The user's budget if mentioned." }
              },
              required: ["location"]
            }
          }
        ]
      };

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true' // Bypass CORS/browser safety since this is a local app
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: `Error: ${data.error.message}` }]);
        setIsLoading(false);
        return;
      }

      // Check if Claude responded with a tool use or a text message
      const toolCals = data.content.filter((c: any) => c.type === 'tool_use');
      const textCals = data.content.filter((c: any) => c.type === 'text');

      let finalText = textCals.map((c: any) => c.text).join('\n');
      let cards: any[] = [];

      if (toolCals.length > 0) {
        for (const tool of toolCals) {
          if (tool.name === 'search_listings') {
            const listings = await fetchListings(tool.input);
            if (listings.length > 0) {
              cards = listings;
              if (!finalText) {
                finalText = `I found some great places for you in ${tool.input.location || 'that area'}:`;
              }
            } else {
               if (!finalText) finalText = `I couldn't find any homes matching that right now.`;
            }
          }
        }
      }

      if (finalText || cards.length > 0) {
        setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'assistant', 
          text: finalText || 'Here are some places:',
          cards: cards.length > 0 ? cards : undefined
        }]);
      }

    } catch (err: any) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: "I'm having trouble connecting to my servers right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    // Add user message immediately
    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMsg }]);
    setInputText('');
    setIsLoading(true);
    
    // Pass to logic
    callClaude(userMsg);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerIcon}>{agent.icon}</Text>
          <Text style={styles.headerTitle}>{agent.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Chat Feed ── */}
      <KeyboardAvoidingView 
        style={styles.chatArea} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          ref={scrollViewRef} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <View key={msg.id} style={[styles.messageWrapper, isUser ? styles.userWrapper : styles.aiWrapper]}>
                
                {/* Avatar for AI */}
                {!isUser && (
                  <View style={styles.aiAvatar}>
                    <Text style={{ fontSize: 16 }}>{agent.icon}</Text>
                  </View>
                )}
                
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
                  {!!msg.text && (
                     <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
                       {msg.text}
                     </Text>
                  )}
                  
                  {/* Embedded Listings Cards */}
                  {msg.cards && msg.cards.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsScroll}>
                      {msg.cards.map((card: any, idx: number) => (
                        <TouchableOpacity 
                           key={card.id || idx} 
                           style={styles.listingCard}
                           onPress={() => navigation.navigate('ListingDetail', { item: {
                             ...card,
                             image: (card.photos && card.photos[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
                             rating: '4.95', badge: 'Agent pick'
                           }})}
                        >
                          <Image 
                            source={{ uri: (card.photos && card.photos[0]) || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600' }} 
                            style={styles.cardImage} 
                          />
                          <View style={styles.cardBody}>
                            <Text style={styles.cardTitle} numberOfLines={1}>{card.title}</Text>
                            <Text style={styles.cardPrice}>₹{card.price} / night</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </View>
            );
          })}
          
          {/* Typing Indicator */}
          {isLoading && (
            <View style={[styles.messageWrapper, styles.aiWrapper]}>
              <View style={styles.aiAvatar}>
                <Text style={{ fontSize: 16 }}>{agent.icon}</Text>
              </View>
              <View style={[styles.bubble, styles.aiBubble, styles.typingBubble]}>
                <ActivityIndicator size="small" color={COLORS.steelBlue} />
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── Input Area ── */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask anything..."
            placeholderTextColor={COLORS.steelBlue}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            textAlignVertical="center"
          />
          <TouchableOpacity 
            style={[styles.sendBtn, inputText.trim().length === 0 && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={inputText.trim().length === 0 || isLoading}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 24,
    color: COLORS.darkNavy,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkNavy,
  },
  chatArea: {
    flex: 1,
    backgroundColor: COLORS.chatbotBg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '100%',
  },
  userWrapper: {
    justifyContent: 'flex-end',
  },
  aiWrapper: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '85%',
  },
  userBubble: {
    backgroundColor: COLORS.darkNavy,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: COLORS.white,
    borderBottomLeftRadius: 4,
    shadowColor: COLORS.darkNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  typingBubble: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: COLORS.white,
  },
  aiText: {
    color: COLORS.darkNavy,
  },
  cardsScroll: {
    marginTop: 12,
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  listingCard: {
    width: 200,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.darkNavy,
    marginBottom: 4,
  },
  cardPrice: {
    fontSize: 13,
    color: COLORS.steelBlue,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    minHeight: 44,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingTop: 12, // Needs both top/bottom spacing to center multiline
    paddingBottom: 12,
    fontSize: 15,
    color: COLORS.darkNavy,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.darkNavy,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sendBtnDisabled: {
    backgroundColor: '#ebebeb',
  },
  sendIcon: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
  }
});
