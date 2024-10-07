import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router"; // Navegação com Expo Router
import { UsuariosService } from "@/services/Usuarios/usuariosService";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
    const { setToken, setUserId, setRegras, setPermissoes } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const response = await UsuariosService.login(email, password);

            if (response instanceof Error) {
                throw response;
            }

            // Salvar informações no provider
            setToken(response.accessToken);
            setUserId(response.id.toString());
            setRegras(response.regras.map((regra) => regra).join(", "));
            setPermissoes(response.permissoes.map((permissao) => permissao).join(", "));

            // Navegar para a Home
            router.push("/");
        } catch (error) {
            Alert.alert("Erro", "Credenciais inválidas ou erro ao processar o login.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                keyboardType="visible-password"
                autoCapitalize="none"
            />

            <Button title="Entrar" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
        backgroundColor: "#f8f8f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        height: 48,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
});
