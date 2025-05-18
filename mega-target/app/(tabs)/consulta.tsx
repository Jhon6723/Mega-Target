import React, { useState } from 'react';
import { TextInput, Button, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
export default function ConsultaScreen() {
  const [tarjetId, setTargetId] = useState('');
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCardDetails = async () => {
    setLoading(true);
    setError(null);
    setBalance(null);
    try {
      const response = await fetch(`http://www.megatarjeta.com.co/Movtarjeta/web?TAR=${tarjetId}`);
      const html = await response.text();
      const match = html.match(/Saldo Actual en Pesos<\/label>\s*([\s\S]*?)<\/div>/i)
      if (match){
        const value = match[1].replace(/<[^>]+>/g, '').trim();
        setBalance(value ? value : '¿Estas seguro de que ingresaste bien el numero de la tarjeta?.');
      } else {

      }
    } catch (e) {
      setError('No, definitivamente es error de la app,.');
    }
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Consulta tu Mega Tarjeta</ThemedText>
      <TextInput
        placeholder="Número de tarjeta"
        value={tarjetId}
        onChangeText={setTargetId}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Consultar" onPress={fetchCardDetails} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} />}
      {error && <ThemedText style={{ color: 'red', marginTop: 20 }}>{error}</ThemedText>}
      {balance && (
        <ScrollView style={styles.resultado}>
          <ThemedText>{balance}</ThemedText>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  title: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#11181C',
    backgroundColor: '#fff',
  },
  resultado: { marginTop: 20, backgroundColor: '#fafafa', padding: 10 },
});