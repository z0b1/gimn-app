import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, Vote, MessageSquare, Landmark, ChevronRight } from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Dobrodošli u</Text>
        <Text style={styles.title}>Gimnazija App</Text>
      </View>

      <View style={styles.grid}>
        <MenuCard 
          icon={Bell} 
          title="Vesti" 
          description="Najnovija dešavanja" 
          onPress={() => navigation.navigate('Vesti')}
          color="#4f46e5"
        />
        <MenuCard 
          icon={Vote} 
          title="Glasanje" 
          description="Tvoj glas je bitan" 
          onPress={() => navigation.navigate('Glasanje')}
          color="#6366f1"
        />
        <MenuCard 
          icon={MessageSquare} 
          title="Feed" 
          description="Zajednica i slike" 
          onPress={() => navigation.navigate('Feed')}
          color="#8b5cf6"
        />
        <MenuCard 
          icon={Landmark} 
          title="Pitanja" 
          description="Pitaj parlament" 
          onPress={() => navigation.navigate('Pitanja')}
          color="#3b82f6"
        />
      </View>
    </ScrollView>
  );
}

function MenuCard({ icon: Icon, title, description, onPress, color }: any) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color + '10' }]}>
        <Icon size={32} color={color} />
      </View>
      <View style={styles.cardText}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{description}</Text>
      </View>
      <ChevronRight size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  welcome: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
  },
  grid: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: '#94a3b8',
  },
});
