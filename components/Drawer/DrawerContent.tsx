import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { Environment } from "@/environment";
import { Theme } from "@react-navigation/native";
import { useAppThemeContext } from "@/contexts/ThemeContext";


export default function DrawerContent({ state, navigation, aoClicarEmBlog, aoClicarEmGerenciarPosts, aoClicarEmGerenciarUsuarios, aoClicarEmAcessarConta, aoClicarEmMinhaConta, aoClicarEmSair, aoClicarEmConfiguracoes }: {
    state: DrawerContentComponentProps['state'],
    navigation: DrawerContentComponentProps['navigation'],
    aoClicarEmBlog: () => void,
    aoClicarEmGerenciarPosts: () => void,
    aoClicarEmGerenciarUsuarios: () => void,
    aoClicarEmAcessarConta: () => void,
    aoClicarEmMinhaConta: () => void,
    aoClicarEmSair: () => void,
    aoClicarEmConfiguracoes: () => void
}) {

    const { session } = useAuth();

    const isActive = (routesName: String[]) => {
        const focusedRoute = state.routes[state.index].name;

        return routesName.includes(focusedRoute);

    };

    const theme = useColorScheme();

    const themeSo = theme as 'light' | 'dark';

    const { DefaultTheme, theme: themeContext } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

    const temaPersonalizadoButton = <A, B>(ativo: boolean, valor1: A, valor2: B): A | B => {

        if (ativo) {
            return valor1;
        } else {
            return valor2;
        }

    }

    const temaPersonalizadoIcone = <A, B>(temaContexto: "light" | "dark" | "automatic", temaSo: "light" | "dark", ativo: boolean, valor1: A, valor2: B): A | B => {

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
            } else if (!ativo) {
                return valor2;
            } else {
                return valor1;
            }
        } else {
            if (ativo) {
                return valor1;
            } else if (!ativo) {
                return valor1;
            } else {
                return valor2;
            }
        };

    }

    const temaPersonalizadoComponent = <A, B, C>(temaContexto: "light" | "dark" | "automatic", temaSo: "light" | "dark", ativo: boolean, valor1: A, valor2: B, valor3: C): A | B | C => {

        if (temaContexto === 'automatic') {
            if (temaSo === 'light' && ativo) {
                return valor1;
            } else if (temaSo === 'dark' && ativo) {
                return valor1;
            } else if (temaSo === 'light' && !ativo) {
                return valor2;
            } else {
                return valor3;
            }
        } else if (temaContexto === 'light') {
            if (ativo) {
                return valor1;
            } else if (!ativo) {
                return valor2;
            } else {
                return valor2;
            }
        } else {
            if (ativo) {
                return valor1;
            } else if (!ativo) {
                return valor3;
            } else {
                return valor3;
            }
        }

    }

    return (
        <View style={styles.container}>
            {/* Opção Home */}
            <TouchableOpacity
                style={temaPersonalizadoButton(isActive(['index', 'posts/public/detail/[id]']), styles.activeOption, styles.option)}
                onPress={aoClicarEmBlog}
            >
                <View style={styles.optionContent}>
                    <MaterialIcons
                        name="home"
                        size={28}
                        color={temaPersonalizadoIcone(themeContext, themeSo, isActive(['index', 'posts/public/detail/[id]']), '#FFF', '#000')}
                    />
                    <Text style={temaPersonalizadoComponent(themeContext, themeSo, isActive(['index', 'posts/public/detail/[id]']), styles.optionActiveTextWhite, styles.optionTextDark, styles.optionTextWhite)}>
                        Blog
                    </Text>
                </View>
            </TouchableOpacity>

            {session && Environment.validaRegraPermissaoComponents(session?.regras || [], [Environment.REGRAS.REGRA_PROFESSOR]) && (
                <TouchableOpacity
                    style={temaPersonalizadoButton(isActive(['posts/private/index', 'posts/private/new/index']), styles.activeOption, styles.option)}
                    onPress={aoClicarEmGerenciarPosts}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons
                            name="post-add"
                            size={28}
                            color={temaPersonalizadoIcone(themeContext, themeSo, isActive(['posts/private/index', 'posts/private/new/index']), '#FFF', '#000')}
                        />
                        <Text style={temaPersonalizadoComponent(themeContext, themeSo, isActive(['posts/private/index', 'posts/private/new/index']), styles.optionActiveTextWhite, styles.optionTextDark, styles.optionTextWhite)}>
                            Gerenciar Posts
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {session && Environment.validaRegraPermissaoComponents(session?.regras || [], [Environment.REGRAS.REGRA_USUARIO]) && (
                <TouchableOpacity
                    style={temaPersonalizadoButton(isActive(['login']), styles.activeOption, styles.option)}
                    onPress={aoClicarEmGerenciarUsuarios}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons
                            name="manage-accounts"
                            size={28}
                            color={temaPersonalizadoIcone(themeContext, themeSo, isActive(['login']), '#FFF', '#000')}
                        />
                        <Text style={temaPersonalizadoComponent(themeContext, themeSo, isActive(['login']), styles.optionActiveTextWhite, styles.optionTextDark, styles.optionTextWhite)}>
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
                style={temaPersonalizadoButton(isActive(['settings/index']), styles.activeOption, styles.option)}
                onPress={aoClicarEmConfiguracoes}>
                <View style={styles.optionContent}>
                    <MaterialIcons
                        name="settings"
                        size={28}
                        color={temaPersonalizadoIcone(themeContext, themeSo, isActive(['settings/index']), '#FFF', '#000')}
                    />
                    <Text style={temaPersonalizadoComponent(themeContext, themeSo, isActive(['settings/index']), styles.optionActiveTextWhite, styles.optionTextDark, styles.optionTextWhite)}>
                        Configurações
                    </Text>
                </View>
            </TouchableOpacity>

            {session ? (
                <TouchableOpacity
                    style={temaPersonalizadoButton(isActive(['profile/[id]']), styles.activeOption, styles.option)}
                    onPress={aoClicarEmMinhaConta}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons
                            name="account-circle"
                            size={24}
                            color={temaPersonalizadoIcone(themeContext, themeSo, isActive(['profile/[id]']), '#FFF', '#000')}
                        />
                        <Text style={temaPersonalizadoComponent(themeContext, themeSo, isActive(['profile/[id]']), styles.optionActiveTextWhite, styles.optionTextDark, styles.optionTextWhite)}>
                            Minha Conta
                        </Text>
                    </View>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={temaPersonalizadoButton(isActive(['login']), styles.activeOption, styles.option)}
                    onPress={aoClicarEmAcessarConta}
                >
                    <View style={styles.optionContent}>
                        <SimpleLineIcons name="login" size={24}
                            color={temaPersonalizadoIcone(themeContext, themeSo, isActive(['login']), '#FFF', '#000')} />
                        <Text style={temaPersonalizadoComponent(themeContext, themeSo, isActive(['login']), styles.optionActiveTextWhite, styles.optionTextDark, styles.optionTextWhite)}>
                            Acessar Conta
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Opção Sair (se houver token) */}
            {session?.token && (
                <TouchableOpacity
                    style={temaPersonalizadoButton(isActive(['login']), styles.activeOption, styles.option)}
                    onPress={aoClicarEmSair}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons
                            name="logout"
                            size={28}
                            color={temaPersonalizadoIcone(themeContext, themeSo, isActive(['login']), '#FFF', '#000')} // Alterei para garantir contraste
                        />
                        <Text style={temaPersonalizadoComponent(themeContext, themeSo, isActive(['login']), styles.optionActiveTextWhite, styles.optionTextDark, styles.optionTextWhite)}>
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

