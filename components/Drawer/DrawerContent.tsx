import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons, SimpleLineIcons, Feather } from '@expo/vector-icons';
import { Environment } from "@/environment";
import { router } from "expo-router";

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

    return (
        <View style={styles.container}>
            {/* Opção Home */}
            <TouchableOpacity
                style={[styles.option, isActive('index') && styles.activeOption]}
                onPress={() => router.push({ pathname: '/', params: { filter: '', page: '1' } })}
            >
                <View style={styles.optionContent}>
                    <Ionicons name="home" size={24} color={isActive('index') ? '#000' : '#333'} />
                    <Text style={[styles.optionText, isActive('index') && styles.activeOptionText]}>
                        Iniciar
                    </Text>
                </View>
            </TouchableOpacity>

            {session && Environment.validaRegraPermissaoComponents(session?.regras || [], [Environment.REGRAS.REGRA_PROFESSOR]) && (
                <TouchableOpacity
                    style={[styles.option, isActive('login') && styles.activeOption]}
                    onPress={aoClicarEmAcessarConta}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons name="post-add" size={28} color={isActive('login') ? '#000' : '#333'} />
                        <Text style={[styles.optionText, isActive('login') && styles.activeOptionText]}>
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
                        <MaterialIcons name="manage-accounts" size={28} color={isActive('login') ? '#000' : '#333'} />
                        <Text style={[styles.optionText, isActive('login') && styles.activeOptionText]}>
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
                    <Feather name="settings" size={24} color="#333" />
                    <Text style={styles.optionText}>Configurações</Text>
                </View>
            </TouchableOpacity>

            {session ? (
                <TouchableOpacity
                    style={[styles.option, isActive('profile/[id]') && styles.activeOption]}
                    onPress={aoClicarEmMinhaConta}
                >
                    <View style={styles.optionContent}>
                        <MaterialIcons name="account-circle" size={24} color={isActive('profile/[id]') ? '#000' : '#333'} />
                        <Text style={[styles.optionText, isActive('profile/[id]') && styles.activeOptionText]}>
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
                        <SimpleLineIcons name="login" size={24} color={isActive('login') ? '#000' : '#333'} />
                        <Text style={[styles.optionText, isActive('login') && styles.activeOptionText]}>
                            Acessar Conta
                        </Text>
                    </View>
                </TouchableOpacity>
            )}

            {/* Opção Sair (se houver token) */}
            {session?.token && (
                <TouchableOpacity style={styles.option} onPress={aoClicarEmSair}>
                    <View style={styles.optionContent}>
                        <SimpleLineIcons name="logout" size={24} color="#333" />
                        <Text style={styles.optionText}>Sair</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    option: {
        paddingVertical: 16,
        borderRadius: 8, // Borda arredondada para as opções

    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10, // Espaço entre a borda e o ícone
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10, // Espaço entre o ícone e o texto
    },
    activeOption: {
        backgroundColor: '#e0e0e0', // Cor de fundo para opção ativa
        borderRadius: 8, // Bordas arredondadas
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
