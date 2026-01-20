import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome</Text>
      <Button
        title="Report Issue"
        onPress={() => navigation.navigate('Report')}
      />
      <View style={styles.spacer} />
      <Button
        title="View Recent Reports"
        onPress={() => navigation.navigate('List')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  spacer: {
    height: 12,
  },
});
