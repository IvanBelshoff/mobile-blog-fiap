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
    const theme = useColorScheme();
    const isActive = (routeName: string) => {
        const focusedRoute = state.routes[state.index].name;
        return focusedRoute === routeName;
    };

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

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
                        color={(theme === 'light' && isActive('index')) ? '#FFF' : (theme === 'dark' && isActive('index')) ? '#FFF' : (theme === 'light' && !isActive('index')) ? '#000' : '#FFF'}
                    />
                    <Text style={[(theme === 'light' && isActive('index')) ? styles.optionActiveTextWhite : (theme === 'dark' && isActive('index')) ? styles.optionActiveTextWhite : (theme === 'light' && !isActive('index')) ? styles.optionTextDark : styles.optionTextWhite]}>
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
                            color={(theme === 'light' && isActive('login')) ? '#FFF' : (theme === 'dark' && isActive('login')) ? '#FFF' : (theme === 'light' && !isActive('login')) ? '#000' : '#FFF'} />
                        <Text style={[(theme === 'light' && isActive('login')) ? styles.optionActiveTextWhite : (theme === 'dark' && isActive('login')) ? styles.optionActiveTextWhite : (theme === 'light' && !isActive('login')) ? styles.optionTextDark : styles.optionTextWhite]}>
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
                            color={(theme === 'light' && isActive('login')) ? '#FFF' : (theme === 'dark' && isActive('login')) ? '#FFF' : (theme === 'light' && !isActive('login')) ? '#000' : '#FFF'} />
                        <Text style={[(theme === 'light' && isActive('login')) ? styles.optionActiveTextWhite : (theme === 'dark' && isActive('login')) ? styles.optionActiveTextWhite : (theme === 'light' && !isActive('login')) ? styles.optionTextDark : styles.optionTextWhite]}>
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
                        color={(theme === 'light' && isActive('settings/index')) ? '#FFF' : (theme === 'dark' && isActive('settings/index')) ? '#FFF' : (theme === 'light' && !isActive('settings/index')) ? '#000' : '#FFF'} />
                    <Text style={[(theme === 'light' && isActive('settings/index')) ? styles.optionActiveTextWhite : (theme === 'dark' && isActive('settings/index')) ? styles.optionActiveTextWhite : (theme === 'light' && !isActive('settings/index')) ? styles.optionTextDark : styles.optionTextWhite]}>
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
                            color={(theme === 'light' && isActive('profile/[id]')) ? '#FFF' : (theme === 'dark' && isActive('profile/[id]')) ? '#FFF' : (theme === 'light' && !isActive('profile/[id]')) ? '#000' : '#FFF'} />
                        <Text style={[(theme === 'light' && isActive('profile/[id]')) ? styles.optionActiveTextWhite : (theme === 'dark' && isActive('profile/[id]')) ? styles.optionActiveTextWhite : (theme === 'light' && !isActive('profile/[id]')) ? styles.optionTextDark : styles.optionTextWhite]}>
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
                            color={(theme === 'light' && isActive('login')) ? '#FFF' : (theme === 'dark' && isActive('login')) ? '#FFF' : (theme === 'light' && !isActive('login')) ? '#000' : '#FFF'} />
                        <Text style={[(theme === 'light' && isActive('login')) ? styles.optionActiveTextWhite : (theme === 'dark' && isActive('login')) ? styles.optionActiveTextWhite : (theme === 'light' && !isActive('login')) ? styles.optionTextDark : styles.optionTextWhite]}>
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
                            color={theme === 'light' ? '#000' : '#FFF'} // Alterei para garantir contraste
                        />
                        <Text style={[theme === 'light' ? styles.optionTextDark : styles.optionTextWhite]}>
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

