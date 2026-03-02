import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Peptide, DoseLog } from '../types';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, logout } = useAuth();
  const [peptides, setPeptides] = useState<Peptide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'peptides'), where('userId', '==', user.uid), where('isActive', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...(doc.data() as Peptide),
        startDate: doc.data().startDate?.toDate?.() || new Date(doc.data().startDate),
        endDate: doc.data().endDate?.toDate?.() || undefined,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));
      setPeptides(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogDose = (peptide: Peptide) => {
    navigation.navigate('LogDose', { peptide });
  };

  const handleLogEffect = (peptide: Peptide) => {
    navigation.navigate('LogEffect', { peptide });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>BIOHACKER</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>ACTIVE CYCLES</Text>

        {loading ? (
          <ActivityIndicator color="#00FFFF" size="large" style={{ marginTop: 20 }} />
        ) : peptides.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No active peptides</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('AddPeptide')}
            >
              <Text style={styles.addBtnText}>+ ADD PEPTIDE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.peptideList}>
            {peptides.map((peptide) => (
              <View key={peptide.id} style={styles.peptideCard}>
                <View style={styles.peptideHeader}>
                  <Text style={styles.peptideName}>{peptide.name}</Text>
                  <Text style={styles.dosage}>{peptide.dosage} {peptide.unit}</Text>
                </View>
                <Text style={styles.frequency}>Every {peptide.frequency}</Text>

                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleLogDose(peptide)}
                  >
                    <Text style={styles.actionText}>LOG DOSE</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleLogEffect(peptide)}
                  >
                    <Text style={styles.actionText}>LOG EFFECT</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.addPeptideBtn}
          onPress={() => navigation.navigate('AddPeptide')}
        >
          <Text style={styles.addPeptideBtnText}>+ ADD NEW PEPTIDE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#00FFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#39FF14',
    borderRadius: 4,
  },
  logoutText: {
    color: '#39FF14',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#39FF14',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    marginBottom: 20,
  },
  addBtn: {
    backgroundColor: '#00FFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  addBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
  peptideList: {
    gap: 12,
  },
  peptideCard: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  peptideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  peptideName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FFFF',
  },
  dosage: {
    color: '#39FF14',
    fontSize: 14,
  },
  frequency: {
    color: '#999',
    fontSize: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#39FF14',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  actionText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  addPeptideBtn: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#00FFFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  addPeptideBtnText: {
    color: '#00FFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
