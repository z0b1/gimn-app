import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Bell, PlayCircle } from 'lucide-react-native';

const mockNews = [
  { id: '1', title: 'Novi pravilnik o ponašanju', date: '14. Mart 2026', mediaUrl: 'https://images.unsplash.com/photo-1544928147-79723465d9d4?q=80&w=400', mediaType: 'IMAGE' },
  { id: '2', title: 'Slike sa turnira u basketu', date: '12. Mart 2026', mediaUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=400', mediaType: 'VIDEO' },
];

export default function VestiScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockNews}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.mediaUrl }} style={styles.image} />
              {item.mediaType === 'VIDEO' && (
                <View style={styles.playOverlay}>
                  <PlayCircle size={40} color="white" />
                </View>
              )}
            </View>
            <View style={styles.details}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  list: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 24, marginBottom: 20, overflow: 'hidden', elevation: 2 },
  imageContainer: { height: 200, width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%' },
  playOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  details: { padding: 16 },
  date: { fontSize: 12, color: '#6366f1', fontWeight: '700', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
});
