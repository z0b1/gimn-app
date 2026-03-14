import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Plus } from 'lucide-react-native';

const mockPosts = [
  { id: '1', user: 'Filip M.', content: 'Nova lab! 🚀', mediaUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400', likes: 124 },
  { id: '2', user: 'Ana K.', content: 'Klub knjige? 📚', likes: 56 },
];

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockPosts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.avatar}><Text style={styles.avatarText}>{item.user[0]}</Text></View>
              <Text style={styles.username}>{item.user}</Text>
            </View>
            <Text style={styles.content}>{item.content}</Text>
            {item.mediaUrl && <Image source={{ uri: item.mediaUrl }} style={styles.media} />}
            <View style={styles.footer}>
              <View style={styles.stat}><Heart size={20} color="#f43f5e" /><Text style={styles.statText}>{item.likes}</Text></View>
              <MessageCircle size={20} color="#94a3b8" />
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab}><Plus size={24} color="white" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  list: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 24, padding: 16, marginBottom: 16, elevation: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: '#6366f1', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontWeight: 'bold' },
  username: { marginLeft: 12, fontWeight: '700', color: '#1e293b' },
  content: { fontSize: 15, color: '#334155', marginBottom: 12 },
  media: { width: '100%', height: 250, borderRadius: 16, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 14, fontWeight: '600', color: '#475569' },
  fab: { position: 'absolute', right: 20, bottom: 20, width: 64, height: 64, borderRadius: 32, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', elevation: 5 },
});
