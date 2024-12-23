import { useAppThemeContext } from '@/contexts/ThemeContext';
import { IPosts } from '@/services/Posts/postsService';
import { Theme } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CardPostPrivate = React.memo(({ post, aoClicarEmPost, aoClicarEmBottomSheet, index, createPost, viewOptions }: { post: IPosts, aoClicarEmPost: () => void, aoClicarEmBottomSheet: (post: Pick<IPosts, 'id' | 'foto' | 'titulo' | 'visivel'>) => void, index: number, createPost: boolean, viewOptions: boolean }) => {

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme, index, createPost, viewOptions);

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

                <View style={styles.sectionOptions}>
                    <Text style={styles.author}>Autor: {post.usuario_cadastrador}</Text>
                    <Text style={styles.date}>
                        {new Date(post.data_criacao).toLocaleDateString("pt-BR")}
                    </Text>
                </View>


                {viewOptions && (
                    <TouchableOpacity onPress={() => aoClicarEmBottomSheet({ id: post.id, titulo: post.titulo, foto: post.foto, visivel: post.visivel })} style={{ alignItems: 'flex-end' }}>
                        <MaterialIcons name="more-vert" size={24} color={DefaultTheme.dark ? '#FFFFFFB3' : '#555'} />
                    </TouchableOpacity>
                )}

            </View>

        </View>
    );
});

// Modifique a função para aceitar o índice
const stylesTeste = (theme: Theme, index: number, createPost: boolean, viewOptions: boolean) => {
    return StyleSheet.create({
        card: {
            borderWidth: 1,
            borderColor: theme.dark ? '#9CA3AF' : theme.colors.border,
            borderRadius: 8,
            padding: 16,
            marginTop: (index === 0 && !createPost) ? 0 : 8,   // Remover marginTop do primeiro item
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
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        sectionOptions: {
            width: viewOptions ? 'auto' : '100%',
            flexDirection: viewOptions ? 'column' : 'row',
            justifyContent: viewOptions ? 'center' : 'space-between',
            alignItems: 'center'
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
