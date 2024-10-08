import { useAuth } from "@/contexts/AuthContext";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DrawerContent({ state, navigation, aoClicarEmAcessarConta, aoClicarEmMinhaConta, aoClicarEmSair }: {
    state: DrawerContentComponentProps['state'],
    navigation: DrawerContentComponentProps['navigation'],
    aoClicarEmAcessarConta: () => void,
    aoClicarEmMinhaConta: () => void,
    aoClicarEmSair: () => void
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
                onPress={() => navigation.navigate('index')}
            >
                <Text style={[styles.optionText, isActive('index') && styles.activeOptionText]}>
                    Home
                </Text>
            </TouchableOpacity>

            {session?.token ? (
                <TouchableOpacity style={[styles.option, isActive('profile/[id]') && styles.activeOption]} onPress={aoClicarEmMinhaConta}>
                    <Text style={[styles.option, isActive('profile/[id]') && styles.activeOption]}>Minha Conta</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={[styles.option, isActive('login') && styles.activeOption]} onPress={aoClicarEmAcessarConta}>
                    <Text style={[styles.option, isActive('login') && styles.activeOption]}>Acessar Conta</Text>
                </TouchableOpacity>
            )}

            {/* Espaço flexível para empurrar Configurações para o final */}
            <View style={{ flex: 1 }} />

            {/* Opção Configurações */}
            <TouchableOpacity style={styles.option}>
                <Text style={styles.optionText}>Configurações</Text>
            </TouchableOpacity>

            {/* Opção Sair (se houver token) */}
            {session?.token && (
                <TouchableOpacity style={styles.option} onPress={aoClicarEmSair}>
                    <Text style={styles.optionText}>Sair</Text>
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
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
    activeOption: {
        backgroundColor: '#e0e0e0', // Cor de fundo quando a opção estiver selecionada
    },
    activeOptionText: {
        fontWeight: 'bold', // Destaque para o texto da opção ativa
    },
});
