import { useAppThemeContext } from '@/contexts/ThemeContext';
import { IPosts } from '@/services/Posts/postsService';
import { Theme } from '@react-navigation/native';
import React, { useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const CardPostPrivate = React.memo(({ post, aoClicarEmPost, aoClicarEmBottomSheet, index }: { post: IPosts, aoClicarEmPost: () => void, aoClicarEmBottomSheet: (id: number) => void, index: number }) => {

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme, index);

    return (
        <View style={styles.card} id={post.id.toString()}>

            {/* Título centralizado */}
            <Text style={styles.title}>{post.titulo}</Text>

            {/* Imagem de capa */}
            {post.foto?.url && (
                <TouchableOpacity onPress={aoClicarEmPost}>
                    <Image
                        source={{ uri: post.foto.url }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            )}

            {/* Autor e data de criação */}
            <View style={styles.footer}>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.author}>Autor: {post.usuario_cadastrador}</Text>
                    <Text style={styles.date}>
                        {new Date(post.data_criacao).toLocaleDateString()}
                    </Text>
                </View>

                {/* Menu suspenso com ícone de opções */}
                <TouchableOpacity onPress={() => aoClicarEmBottomSheet(post.id)} style={{ alignItems: 'flex-end' }}>
                    <MaterialIcons name="more-vert" size={24} color={'#FFF'} />
                </TouchableOpacity>
            </View>

        </View>
    );
});

// Modifique a função para aceitar o índice
const stylesTeste = (theme: Theme, index: number) => {
    return StyleSheet.create({
        card: {
            borderWidth: 1,
            borderColor: theme.dark ? '#9CA3AF' : theme.colors.border,
            borderRadius: 8,
            padding: 16,
            marginTop: index === 0 ? 0 : 8,  // Remover marginTop do primeiro item
            marginBottom: 8,
            backgroundColor: theme.colors.card,
        },

        title: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            color: theme.colors.text,
            marginBottom: 12,
        },
        image: {
            width: '100%',
            height: 200,
            borderRadius: 8,
            marginBottom: 12,
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        author: {
            fontSize: 14,
            color: theme.dark ? '#FFFFFFB3' : '#555',
        },
        date: {
            fontSize: 14,
            color: theme.dark ? '#FFFFFFB3' : '#555',
        }
    });
}

export default CardPostPrivate;
