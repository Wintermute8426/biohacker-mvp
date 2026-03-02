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

interface LogEffectScreenProps {
  navigation: any;
  route: any;
}

export const LogEffectScreen: React.FC<LogEffectScreenProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const peptide: Peptide = route.params.peptide;
  const [severity, setSeverity] = useState(5);
  const [type, setType] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const effectTypes = ['Fatigue', 'Headache', 'Nausea', 'Joint Pain', 'Muscle Soreness', 'Mood Change', 'Sleep Issue', 'Other'];

  const handleLogEffect = async () => {
    if (!type.trim()) {
      Alert.alert('Error', 'Please select or describe an effect');
      return;
    }

    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'sideEffects'), {
        peptideId: peptide.id,
        userId: user.uid,
        severity,
        type: type.trim(),
        notes: notes.trim() || null,
        timestamp: Timestamp.now(),
      });

      Alert.alert('Success', 'Side effect logged!');
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
        <Text style={styles.title}>LOG EFFECT</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.peptideInfo}>
          <Text style={styles.peptideName}>{peptide.name}</Text>
        </View>

        <Text style={styles.label}>Effect Type</Text>
        <View style={styles.effectGrid}>
          {effectTypes.map((effect) => (
            <TouchableOpacity
              key={effect}
              style={[
                styles.effectBtn,
                type === effect && styles.effectBtnActive,
              ]}
              onPress={() => setType(effect)}
            >
              <Text
                style={[
                  styles.effectText,
                  type === effect && styles.effectTextActive,
                ]}
              >
                {effect}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Severity (1-10)</Text>
        <View style={styles.severityContainer}>
          <View style={styles.severityDisplay}>
            <Text style={styles.severityValue}>{severity}</Text>
          </View>
          <View style={styles.severitySlider}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.severityBtn,
                  severity === num && styles.severityBtnActive,
                ]}
                onPress={() => setSeverity(num)}
              >
                <Text style={styles.severityText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="Describe the effect in detail..."
          placeholderTextColor="#666"
          value={notes}
          onChangeText={setNotes}
          multiline
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleLogEffect}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.submitText}>LOG EFFECT</Text>
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
  },
  label: {
    color: '#39FF14',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 16,
  },
  effectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  effectBtn: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  effectBtnActive: {
    backgroundColor: '#00FFFF',
  },
  effectText: {
    color: '#00FFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  effectTextActive: {
    color: '#000',
  },
  severityContainer: {
    marginBottom: 24,
  },
  severityDisplay: {
    backgroundColor: '#0a0a0a',
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 6,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  severityValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#39FF14',
  },
  severitySlider: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  severityBtn: {
    width: '9%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#00FFFF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityBtnActive: {
    backgroundColor: '#39FF14',
  },
  severityText: {
    color: '#00FFFF',
    fontSize: 10,
    fontWeight: 'bold',
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
