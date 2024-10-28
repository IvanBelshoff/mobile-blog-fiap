import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Ícones do Expo
import { DrawerHeaderProps } from '@react-navigation/drawer';
import { Link, router } from 'expo-router';
import { Environment } from '@/environment';
import { useAppThemeContext } from '@/contexts/ThemeContext';
import { Theme } from '@react-navigation/native';

export default function Header({ props, onSearch }: { props: DrawerHeaderProps, onSearch: (query: string) => void }) {
  // Estado para o texto do input
  const [searchQuery, setSearchQuery] = useState('');

  // Função para limpar o input
  const clearSearch = () => {
    setSearchQuery(''); // Limpa o texto
    onSearch(''); // Atualiza o estado da pesquisa
  };

  const { DefaultTheme } = useAppThemeContext();

  const styles = stylesTeste(DefaultTheme);

  return (
    <View
      style={{ flexDirection: 'column' }}
    >
      <View style={styles.headerContainer}>

        {props.route.name != 'index' ? (

          (props.route.name === 'posts/private/new/index' || props.route.name === 'posts/private/detail/[id]') ? (
            <Link href={'/posts/private'} style={{ cursor: 'pointer' }}>
              <Ionicons name="chevron-back-outline" size={25} color="#FFF" />
            </Link>
          ) : (props.route.name === 'users/new/index' || props.route.name === 'users/detail/[id]' || props.route.name === 'users/rules/[id]') ? (
            <Link href={'/users'} style={{ cursor: 'pointer' }}>
              <Ionicons name="chevron-back-outline" size={25} color="#FFF" />
            </Link>
          ) : (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={25} color="#FFF" />
            </TouchableOpacity>
          )

        ) : (
          <Link href={`/?filter=&page=1`} style={{ cursor: 'pointer' }}>
            <MaterialIcons name="home" size={28} color="#FFF" />
          </Link>
        )}

        {(props.route.name === 'index' || props.route.name === 'posts/private/index' || props.route.name === 'users/index') ? (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder={Environment.INPUT_DE_BUSCA}
              style={styles.searchInput}
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text); // Atualiza o texto do input
                onSearch(text); // Chama a função de busca com o texto atualizado
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <MaterialIcons name="clear" size={24} color="#FFF" style={styles.clearIcon} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.titleContainer}>
            {props.route.name === 'settings/index' && (
              <Text style={styles.sectionTitle}>Configurações</Text>
            )}
            {props.route.name === 'profile/[id]' && (
              <Text style={styles.sectionTitle}>Minha Conta</Text>
            )}
            {props.route.name === 'posts/public/detail/[id]' && (
              <Text style={styles.sectionTitle}>Post</Text>
            )}
            {props.route.name === 'posts/private/new/index' && (
              <Text style={styles.sectionTitle}>Novo Post</Text>
            )}
            {props.route.name === 'posts/private/detail/[id]' && (
              <Text style={styles.sectionTitle}>Editar Post</Text>
            )}
            {props.route.name === 'users/new/index' && (
              <Text style={styles.sectionTitle}>Novo Usuário</Text>
            )}
            {props.route.name === 'users/detail/[id]' && (
              <Text style={styles.sectionTitle}>Editar Usuário</Text>
            )}
            {props.route.name === 'users/rules/[id]' && (
              <Text style={styles.sectionTitle}>Gerenciar Permissões</Text>
            )}
          </View>
        )
        }

        <TouchableOpacity>
          <Ionicons onPress={() => props.navigation.toggleDrawer()} name="menu" size={28} color="#FFF" />
        </TouchableOpacity>

      </View>

      {
        props.route.name === 'posts/private/index' && (
          <View style={styles.headerContainerButton}>
            <TouchableOpacity style={styles.buttonAddContainer} onPress={() => router.push('/posts/private/new')}>
              <MaterialIcons style={styles.iconButton} name="add" size={24} color={DefaultTheme.dark ? DefaultTheme.colors.primary : '#FFF'} />
              <Text style={styles.buttonTextUpload}>Novo Post</Text>
            </TouchableOpacity>
          </View>
        )
      }

      {
        props.route.name === 'users/index' && (
          <View style={styles.headerContainerButton}>
            <TouchableOpacity style={styles.buttonAddContainer} onPress={() => router.push('/users/new')}>
              <MaterialIcons style={styles.iconButton} name="add" size={24} color={DefaultTheme.dark ? DefaultTheme.colors.primary : '#FFF'} />
              <Text style={styles.buttonTextUpload}>Novo Usuário</Text>
            </TouchableOpacity>
          </View>
        )
      }

    </View >
  );
}

const stylesTeste = (theme: Theme) => {
  return StyleSheet.create({
    buttonAddContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.dark ? '#FFF' : theme.colors.primary,
      borderRadius: 8,  // Cantos arredondados
      paddingVertical: 12,
      flex: 1,
      paddingHorizontal: 12
    },
    iconButton: {
      marginRight: 8,
    },
    buttonTextUpload: {
      color: theme.dark ? theme.colors.primary : '#FFF',
      fontSize: 15,
      fontWeight: "bold",
      marginLeft: 2, // Espaço entre o ícone e o texto
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 15,
      paddingVertical: 15,
      gap: 15,
      backgroundColor: theme.colors.primary,
    },
    headerContainerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
      marginTop: 16,
      marginBottom: 16,
      paddingHorizontal: 10,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      gap: 10
    },
    titleContainer: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      flex: 1,
    },
    searchInput: {
      flex: 1,
      height: 40,
      paddingHorizontal: 10,
      borderRadius: 8,
      backgroundColor: '#fff',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: '#FFF'
    },
    clearIcon: {
      marginRight: 10,
    },
  });
} 
