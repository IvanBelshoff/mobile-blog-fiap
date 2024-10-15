import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons, } from '@expo/vector-icons'; // Ícones do Expo
import { Link } from 'expo-router';

export default function HeaderLogin() {

    return (
        <View style={styles.headerContainer}>

            <Link href={`/?filter=&page=1`} style={{ cursor: 'pointer' }}>
                <Ionicons name="close" size={25} color="black" />
            </Link>

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
        backgroundColor: 'transparent',
    },
});
