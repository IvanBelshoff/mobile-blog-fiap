import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ícones do Expo
import { Link } from 'expo-router';
import { Theme } from '@react-navigation/native';
import { useAppThemeContext } from '@/contexts/ThemeContext';

export default function HeaderLogin() {

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

    return (
        <View style={styles.headerContainer}>

            <Link href={`/?filter=&page=1`} style={{ cursor: 'pointer' }}>
                <Ionicons name="chevron-back-outline" size={25} color="#FFF" />
            </Link>

            <View style={styles.titleContainer}>
                <Text style={styles.sectionTitle}>Tela de Login</Text>
            </View>
        </View>
    );
}

const stylesTeste = (theme: Theme) => {
    return StyleSheet.create({
        headerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 15,
            paddingVertical: 15,
            gap: 15,
            backgroundColor: theme.colors.primary,
        },
        titleContainer: {
            alignItems: 'flex-start',
            justifyContent: 'center',
            flex: 1,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: "bold",
            color: '#FFF'
        },
    });
}
