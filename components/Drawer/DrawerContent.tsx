import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { Ionicons, MaterialIcons, SimpleLineIcons, Feather } from '@expo/vector-icons';
import { Environment } from "@/environment";
import { router } from "expo-router";
import { Theme } from "@react-navigation/native";
import { useAppThemeContext } from "@/contexts/ThemeContext";


export default function DrawerContent({ state, navigation, aoClicarEmAcessarConta, aoClicarEmMinhaConta, aoClicarEmSair, aoClicarEmConfiguracoes }: {
    state: DrawerContentComponentProps['state'],
    navigation: DrawerContentComponentProps['navigation'],
    aoClicarEmAcessarConta: () => void,
    aoClicarEmMinhaConta: () => void,
    aoClicarEmSair: () => void,
    aoClicarEmConfiguracoes: () => void
}) {
    const { session } = useAuth();
    const isActive = (routeName: string) => {
        const focusedRoute = state.routes[state.index].name;
        return focusedRoute === routeName;
    };
    const themeSo = useColorScheme();

    const { DefaultTheme, theme: themeContext } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

    const temaPersonalizado = <A, B, C>(tipoEstilo: 'icone' | 'component', temaContexto: "light" | "dark" | "automatic", temaSo: "light" | "dark", ativo: boolean, valor1: A, valor2: B, valor?: C): A | B | C => {

        if (tipoEstilo === 'icone') {
            if (temaContexto === 'automatic') {
                if (temaSo === 'light' && ativo) {
                    return valor1;
                } else if (temaSo === 'dark' && ativo) {
                    return valor1;
                } else if (temaSo === 'light' && !ativo) {
                    return valor2;
                } else {
                    return valor1;
                }
            } else if (temaContexto === 'light') {
                if (ativo) {
                    return valor1;
                } else {
                    return valor2;
                }
            } else {
                if (ativo) {
                    return valor1;
                } else {
                    return valor2;
                }
                // lógica restante
            };
        } else {
            return valor as C;
        }


    }

    return (
        <View style={styles.container}>
            {/* Opção Home */}
            <TouchableOpacity
                style={[styles.option, isActive('index') && styles.activeOption]}
                onPress={() => router.push({ pathname: '/', params: { filter: '', page: '1' } })}
            >
                <View style={styles.optionContent}>
                    <MaterialIcons
                        name="home"
                        size={28}
                        color={temaPersonalizado('icone', themeContext, themeSo as 'light' | 'dark', isActive('index'), '#FFF', '#000')}
                    />
                    <Text style={[(themeSo === 'light' && isActive('index')) ? styles.optionActiveTextWhite : (themeSo === 'dark' && isActive('index')) ? styles.optionActiveTextWhite : (themeSo === 'light' && !isActive('index')) ? styles.optionTextDark : styles.optionTextWhite]}>
                        Blog
                    </Text>
                </View>
            </TouchableOpacity>

            {session && Environment.validaRegraPermissaoComponents(session?.regras || [], [Environment.REGRAS.REGRA_PROFESSOR]) && (
                <TouchableOpacity
                    style={[styles.option, isActive('login') && styles.activeOption]}
                    onPress={aoClicarEmAcessarConta}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons name="post-add" size={28}
                            color={(themeSo === 'light' && isActive('login')) ? '#FFF' : (themeSo === 'dark' && isActive('login')) ? '#FFF' : (themeSo === 'light' && !isActive('login')) ? '#000' : '#FFF'} />
                        <Text style={[(themeSo === 'light' && isActive('login')) ? styles.optionActiveTextWhite : (themeSo === 'dark' && isActive('login')) ? styles.optionActiveTextWhite : (themeSo === 'light' && !isActive('login')) ? styles.optionTextDark : styles.optionTextWhite]}>
                            Gerenciar Posts
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {session && Environment.validaRegraPermissaoComponents(session?.regras || [], [Environment.REGRAS.REGRA_USUARIO]) && (
                <TouchableOpacity
                    style={[styles.option, isActive('login') && styles.activeOption]}
                    onPress={aoClicarEmAcessarConta}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons name="manage-accounts" size={28}
                            color={(themeSo === 'light' && isActive('login')) ? '#FFF' : (themeSo === 'dark' && isActive('login')) ? '#FFF' : (themeSo === 'light' && !isActive('login')) ? '#000' : '#FFF'} />
                        <Text style={[(themeSo === 'light' && isActive('login')) ? styles.optionActiveTextWhite : (themeSo === 'dark' && isActive('login')) ? styles.optionActiveTextWhite : (themeSo === 'light' && !isActive('login')) ? styles.optionTextDark : styles.optionTextWhite]}>
                            Gerenciar Usuários
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Espaço flexível para empurrar Configurações para o final */}
            <View style={{ flex: 1 }} />

            <View style={styles.divider} />

            {/* Opção Configurações */}
            <TouchableOpacity
                style={[styles.option, isActive('settings/index') && styles.activeOption]}
                onPress={aoClicarEmConfiguracoes}>
                <View style={styles.optionContent}>
                    <MaterialIcons name="settings" size={28}
                        color={(themeSo === 'light' && isActive('settings/index')) ? '#FFF' : (themeSo === 'dark' && isActive('settings/index')) ? '#FFF' : (themeSo === 'light' && !isActive('settings/index')) ? '#000' : '#FFF'} />
                    <Text style={[(themeSo === 'light' && isActive('settings/index')) ? styles.optionActiveTextWhite : (themeSo === 'dark' && isActive('settings/index')) ? styles.optionActiveTextWhite : (themeSo === 'light' && !isActive('settings/index')) ? styles.optionTextDark : styles.optionTextWhite]}>
                        Configurações</Text>
                </View>
            </TouchableOpacity>

            {session ? (
                <TouchableOpacity
                    style={[styles.option, isActive('profile/[id]') && styles.activeOption]}
                    onPress={aoClicarEmMinhaConta}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons name="account-circle" size={24}
                            color={(themeSo === 'light' && isActive('profile/[id]')) ? '#FFF' : (themeSo === 'dark' && isActive('profile/[id]')) ? '#FFF' : (themeSo === 'light' && !isActive('profile/[id]')) ? '#000' : '#FFF'} />
                        <Text style={[(themeSo === 'light' && isActive('profile/[id]')) ? styles.optionActiveTextWhite : (themeSo === 'dark' && isActive('profile/[id]')) ? styles.optionActiveTextWhite : (themeSo === 'light' && !isActive('profile/[id]')) ? styles.optionTextDark : styles.optionTextWhite]}>
                            Minha Conta
                        </Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={[styles.option, isActive('login') && styles.activeOption]}
                    onPress={aoClicarEmAcessarConta}
                >
                    <View style={styles.optionContent}>
                        <SimpleLineIcons name="login" size={24}
                            color={(themeSo === 'light' && isActive('login')) ? '#FFF' : (themeSo === 'dark' && isActive('login')) ? '#FFF' : (themeSo === 'light' && !isActive('login')) ? '#000' : '#FFF'} />
                        <Text style={[(themeSo === 'light' && isActive('login')) ? styles.optionActiveTextWhite : (themeSo === 'dark' && isActive('login')) ? styles.optionActiveTextWhite : (themeSo === 'light' && !isActive('login')) ? styles.optionTextDark : styles.optionTextWhite]}>
                            Acessar Conta
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Opção Sair (se houver token) */}
            {session?.token && (
                <TouchableOpacity style={styles.option} onPress={aoClicarEmSair}>
                    <View style={styles.optionContent}>
                        <MaterialIcons
                            name="logout"
                            size={28}
                            color={themeSo === 'light' ? '#000' : '#FFF'} // Alterei para garantir contraste
                        />
                        <Text style={[themeSo === 'light' ? styles.optionTextDark : styles.optionTextWhite]}>
                            Sair
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

        </View>
    );
}

const stylesTeste = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
            padding: 16,
        },
        option: {
            paddingVertical: 16,
            borderRadius: 8, // Borda arredondada para as opções
        },
        activeOption: {
            backgroundColor: theme.colors.primary,
            paddingVertical: 16, // Cor de fundo para opção ativa
            borderRadius: 8, // Bordas arredondadas
        },
        optionContent: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 10, // Espaço entre a borda e o ícone
        },
        optionActiveTextWhite: {
            fontSize: 16,
            color: '#FFF',
            marginLeft: 10,
            fontWeight: 'bold'
        },
        optionTextWhite: {
            fontSize: 16,
            color: '#FFF',
            marginLeft: 10
        },
        optionTextDark: {
            fontSize: 16,
            color: '#000',
            marginLeft: 10
        },
        activeOptionText: {
            fontWeight: 'bold', // Texto em negrito para opção ativa
        },
        divider: {
            borderBottomColor: '#ddd',
            borderBottomWidth: 1,
            marginTop: 8,
            marginBottom: 8,
        },
    });
}

