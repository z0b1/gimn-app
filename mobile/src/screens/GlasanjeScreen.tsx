import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Vote } from 'lucide-react-native';

const mockVotes = [
  { id: '1', title: 'Besplatno voće u kantini', votesYes: 450, votesNo: 20, endDate: '20. Mart' },
  { id: '2', title: 'Duži veliki odmor (30min)', votesYes: 780, votesNo: 45, endDate: '18. Mart' },
];

export default function GlasanjeScreen() {
  return (
    <View style={styles.container}>
      <FlatList
        data={mockVotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.endDate}>Rok: {item.endDate}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${(item.votesYes / (item.votesYes + item.votesNo)) * 100}%` }]} />
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={[styles.btn, styles.btnZa]}><Text style={styles.btnText}>ZA</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnProtiv]}><Text style={styles.btnTextProtiv}>PROTIV</Text></TouchableOpacity>
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
  card: { backgroundColor: 'white', borderRadius: 24, padding: 20, marginBottom: 20, elevation: 2 },
  endDate: { fontSize: 12, color: '#94a3b8', marginBottom: 8 },
  cardTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 16 },
  progressContainer: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, marginBottom: 20 },
  progressBar: { height: '100%', backgroundColor: '#4f46e5', borderRadius: 4 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  btnZa: { backgroundColor: '#4f46e5' },
  btnProtiv: { borderWidth: 1, borderColor: '#e2e8f0' },
  btnText: { color: 'white', fontWeight: '700' },
  btnTextProtiv: { color: '#1e293b', fontWeight: '700' },
});
