import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Ícones do Expo
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Link, router } from 'expo-router';
import { Environment } from '@/environment';

export default function Header({ props, onSearch }: { props: DrawerHeaderProps, onSearch: (query: string) => void }) {
  // Estado para o texto do input
  const [searchQuery, setSearchQuery] = useState('');

  // Função para limpar o input
  const clearSearch = () => {
    setSearchQuery(''); // Limpa o texto
    onSearch(''); // Atualiza o estado da pesquisa
  };

  return (
    <View style={styles.headerContainer}>
      {props.route.name != 'index' ? (
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back-outline" size={25} color="black" />
        </TouchableOpacity>
      ) : (
        <Link href={`/?filter=&page=1`} style={{ cursor: 'pointer' }}>
          <Ionicons name="home-outline" size={25} color="black" />
        </Link>
      )
      }


      {
        props.route.name === 'index' && (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder={Environment.INPUT_DE_BUSCA}
              style={styles.searchInput}
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text); // Atualiza o texto do input
                onSearch(text); // Chama a função de busca com o texto atualizado
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <MaterialIcons name="clear" size={24} color="#999" style={styles.clearIcon} />
              </TouchableOpacity>
            )}
          </View>
        )
      }

      <TouchableOpacity>
        <Ionicons onPress={() => props.navigation.toggleDrawer()} name="menu" size={25} color="black" />
      </TouchableOpacity>
    </View >
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 10
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  clearIcon: {
    marginRight: 10,
  },
});
