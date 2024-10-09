import { IPosts } from '@/services/Posts/postsService';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CardPost = React.memo(({ post }: { post: IPosts }) => {
    return (
        <View style={styles.card}>
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
        </View>
    );
});

const styles = StyleSheet.create({
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
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
        color: '#555',
    },
    date: {
        fontSize: 14,
        color: '#555',
    },
});

export default CardPost;