import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { Peptide } from '../types';

interface LogDoseScreenProps {
  navigation: any;
  route: any;
}

export const LogDoseScreen: React.FC<LogDoseScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const peptide: Peptide = route.params.peptide;
  const [dosageAmount, setDosageAmount] = useState(peptide.dosage.toString());
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogDose = async () => {
    if (!dosageAmount.trim()) {
      Alert.alert('Error', 'Please enter dosage amount');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'doseLogs'), {
        peptideId: peptide.id,
        userId: user.uid,
        dosageAmount: parseFloat(dosageAmount),
        timestamp: Timestamp.now(),
        notes: notes.trim() || null,
      });

      Alert.alert('Success', `Dose logged for ${peptide.name}!`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>LOG DOSE</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.peptideInfo}>
          <Text style={styles.peptideName}>{peptide.name}</Text>
          <Text style={styles.peptideUnit}>{peptide.unit}</Text>
        </View>

        <Text style={styles.label}>Dosage Amount</Text>
        <View style={styles.dosageInput}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            placeholderTextColor="#666"
            value={dosageAmount}
            onChangeText={setDosageAmount}
            keyboardType="decimal-pad"
            editable={!loading}
          />
          <Text style={styles.unit}>{peptide.unit}</Text>
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Any additional notes..."
          placeholderTextColor="#666"
          value={notes}
          onChangeText={setNotes}
          multiline
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleLogDose}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>CONFIRM LOG</Text>
          )}
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
  backButton: {
    color: '#39FF14',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00FFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  peptideInfo: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  peptideName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 4,
  },
  peptideUnit: {
    color: '#39FF14',
    fontSize: 14,
  },
  label: {
    color: '#39FF14',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dosageInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 6,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    backgroundColor: '#0a0a0a',
  },
  unit: {
    color: '#00FFFF',
    fontWeight: 'bold',
    minWidth: 50,
  },
  notesInput: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  submitBtn: {
    backgroundColor: '#00FFFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
