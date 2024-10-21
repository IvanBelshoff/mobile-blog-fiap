import { useAppThemeContext } from '@/contexts/ThemeContext';
import { IPosts } from '@/services/Posts/postsService';
import { Theme } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const CardPostPublic = React.memo(({ post, aoClicarEmPost }: { post: IPosts, aoClicarEmPost: () => void }) => {

    const { DefaultTheme } = useAppThemeContext();

    // Passe o índice para a função de estilos
    const styles = stylesTeste(DefaultTheme);

    return (
        <TouchableOpacity style={styles.card} onPress={aoClicarEmPost}>

            {/* Título centralizado */}
            <Text style={styles.title}>{post.titulo}</Text>

            {/* Imagem de capa */}
            {post.foto?.url && (
                <Image
                    source={{ uri: post.foto.url }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            {/* Autor e data de criação */}
            <View style={styles.footer}>
                <Text style={styles.author}>Autor: {post.usuario_cadastrador}</Text>
                <Text style={styles.date}>
                    {new Date(post.data_criacao).toLocaleDateString()}
                </Text>
            </View>

        </TouchableOpacity>
    );
});

// Modifique a função para aceitar o índice
const stylesTeste = (theme: Theme) => {
    return StyleSheet.create({
        card: {
            borderWidth: 1,
            borderColor: theme.dark ? '#9CA3AF' : theme.colors.border,
            borderRadius: 8,
            padding: 16,
            marginVertical: 8,
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
        },
        author: {
            fontSize: 14,
            color: theme.dark ? '#FFFFFFB3' : '#555',
        },
        date: {
            fontSize: 14,
            color: theme.dark ? '#FFFFFFB3' : '#555',
        },
    });
}

export default CardPostPublic;
