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

interface AddPeptideScreenProps {
  navigation: any;
}

export const AddPeptideScreen: React.FC<AddPeptideScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('mg');
  const [frequency, setFrequency] = useState('daily');
  const [loading, setLoading] = useState(false);

  const handleAddPeptide = async () => {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'peptides'), {
        name: name.trim(),
        dosage: parseFloat(dosage),
        unit,
        frequency,
        startDate: Timestamp.now(),
        userId: user.uid,
        isActive: true,
        createdAt: Timestamp.now(),
      });

      Alert.alert('Success', `${name} added to your cycle!`);
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
        <Text style={styles.title}>ADD PEPTIDE</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Peptide Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Epitalon, BPC-157, TB-500"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />

        <Text style={styles.label}>Dosage</Text>
        <View style={styles.dosageRow}>
          <TextInput
            style={[styles.input, styles.dosageInput]}
            placeholder="Amount"
            placeholderTextColor="#666"
            value={dosage}
            onChangeText={setDosage}
            keyboardType="decimal-pad"
            editable={!loading}
          />
          <View style={styles.unitSelect}>
            <Text style={styles.unitText}>{unit}</Text>
          </View>
        </View>

        <Text style={styles.label}>Frequency</Text>
        <View style={styles.frequencyOptions}>
          {['daily', 'every other day', 'twice daily', 'weekly'].map((freq) => (
            <TouchableOpacity
              key={freq}
              style={[
                styles.frequencyBtn,
                frequency === freq && styles.frequencyBtnActive,
              ]}
              onPress={() => setFrequency(freq)}
            >
              <Text
                style={[
                  styles.frequencyText,
                  frequency === freq && styles.frequencyTextActive,
                ]}
              >
                {freq.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleAddPeptide}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>ADD TO CYCLE</Text>
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
  label: {
    color: '#39FF14',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
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
  dosageRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dosageInput: {
    flex: 1,
  },
  unitSelect: {
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#0a0a0a',
    minWidth: 80,
    alignItems: 'center',
  },
  unitText: {
    color: '#00FFFF',
    fontWeight: 'bold',
  },
  frequencyOptions: {
    gap: 8,
  },
  frequencyBtn: {
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  frequencyBtnActive: {
    backgroundColor: '#00FFFF',
  },
  frequencyText: {
    color: '#00FFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  frequencyTextActive: {
    color: '#000',
  },
  submitBtn: {
    backgroundColor: '#00FFFF',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 30,
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
