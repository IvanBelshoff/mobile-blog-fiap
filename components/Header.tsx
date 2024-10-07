import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ícones do Expo
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Link } from 'expo-router';
import { EXPO_INPUT_DE_BUSCA } from '@env';

export default function Header({ props, onSearch }: { props: DrawerHeaderProps, onSearch: (query: string) => void }) {

  return (
    <View style={styles.headerContainer}>
      <Link href={'/'} style={{ cursor: 'pointer' }}>
        <Ionicons name="home-outline" size={25} color="black" />
      </Link>
      {props.route.name === 'index' && (
        <TextInput
          placeholder={EXPO_INPUT_DE_BUSCA}
          style={styles.searchInput}
          placeholderTextColor="#999"
          onChangeText={onSearch} // Atualiza o estado da pesquisa a cada alteração de texto
        />
      )}
      <TouchableOpacity>
        <Ionicons onPress={() => props.navigation.toggleDrawer()} name="menu" size={25} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    gap: 15,
    backgroundColor: '#f8f8f8',
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
});
