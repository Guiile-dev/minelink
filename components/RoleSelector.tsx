import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  selectedRole: string;
  onSelectRole: (role: string) => void;
};

const RoleSelector: React.FC<Props> = ({ selectedRole, onSelectRole }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de empresa:</Text>
      <View style={styles.roles}>
        {['Proveedor', 'Comprador'].map((role) => (
          <TouchableOpacity
            key={role}
            style={[styles.button, selectedRole === role && styles.selected]}
            onPress={() => onSelectRole(role)}
          >
            <Text style={[styles.text, selectedRole === role && styles.textSelected]}>
              {role}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { marginBottom: 5 },
  roles: { flexDirection: 'row', justifyContent: 'space-around' },
  button: {
    borderWidth: 1,
    borderColor: '#555',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  selected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  text: {
    color: '#333',
    fontWeight: 'bold',
  },
  textSelected: {
    color: '#fff',
  },
});

export default RoleSelector;
