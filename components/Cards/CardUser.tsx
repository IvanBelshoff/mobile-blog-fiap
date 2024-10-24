import { useAppThemeContext } from '@/contexts/ThemeContext';
import { IUsuarioCompleto } from '@/services/Usuarios/interfaces/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '@react-navigation/native';
import { format } from 'date-fns';
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const CardUser = React.memo(({ user, aoClicarEmUser, aoClicarEmBottomSheet, index }: { user: IUsuarioCompleto, aoClicarEmUser: () => void, aoClicarEmBottomSheet: (user: Pick<IUsuarioCompleto, 'id' | 'foto' | 'nome' | 'sobrenome' | 'email'>) => void, index: number }) => {


    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme, index);

    return (
        <View style={styles.card} id={user.id.toString()}>

            <TouchableOpacity style={styles.imageContainer} onPress={aoClicarEmUser} >
                <Image
                    source={{ uri: user.foto.url }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </TouchableOpacity>

            <TouchableOpacity style={styles.userContainer} onPress={() => aoClicarEmBottomSheet({ id: user.id, email: user.email, foto: user.foto, nome: user.nome, sobrenome: user.sobrenome })} >
                {/* Título centralizado */}
                <Text style={styles.text}>Nome: {user.nome} {user.sobrenome}</Text>
                <Text style={styles.text}>E-mail: {user.email}</Text>
                <Text style={styles.text}>Status: {user.bloqueado === true ? 'Bloqueado' : 'Ativo'}</Text>
                {user.ultimo_login ? (
                    <Text style={styles.text}>Login: {format(new Date(user.ultimo_login), "dd/MM/yyyy HH:mm:ss")}</Text>
                ) : (
                    <Text style={styles.text}>Login: Nunca acessou</Text>
                )}
            </TouchableOpacity>

        </View>
    );
});

// Modifique a função para aceitar o índice
const stylesTeste = (theme: Theme, index: number) => {
    return StyleSheet.create({
        card: {
            borderWidth: 1,
            flexDirection: 'row',
            borderColor: theme.dark ? '#9CA3AF' : theme.colors.border,
            borderRadius: 8,
            padding: 10,
            marginTop: index === 0 ? 0 : 8,  // Remover marginTop do primeiro item
            marginBottom: 8,
            backgroundColor: theme.colors.card,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1
        },
        text: {
            color: theme.colors.text,
        },
        imageContainer: {
            width: '30%',
            height: 100
        },
        image: {
            width: '100%',
            height: '100%',
            borderRadius: 8,
            marginBottom: 12,
            borderColor: theme.colors.primary,
            borderWidth: 2
        },
        userContainer: {
            flex: 1,
            gap: 3,
            alignItems: 'flex-start',
            paddingLeft: 10
        }
    });
}

export default CardUser;
