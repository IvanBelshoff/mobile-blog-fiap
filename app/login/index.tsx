import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { UsuariosService } from "@/services/Usuarios/usuariosService";
import { useAuth } from "@/contexts/AuthContext";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'; // Ícones do Expo
import { Theme } from "@react-navigation/native";
import { useAppThemeContext } from "@/contexts/ThemeContext";

export default function Login() {

    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const [login, setLogin] = useState<boolean>(true);

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

    const handleLogin = async () => {
        try {
            const response = await UsuariosService.login(email, password);

            if (response instanceof Error) {
                throw response;
            }

            signIn({
                token: response.accessToken,
                userId: response.id.toString(),
                regras: response.regras,
                permissoes: response.permissoes
            });

            // Navegar para a Home
            router.push("/");
        } catch (error) {
            Alert.alert("Erro", "Credenciais inválidas ou erro ao processar o login.");
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleResetPassword = async () => {
        try {
            const response = await UsuariosService.recoverPassword(email);

            if (response instanceof Error) {
                throw response;
            } else {
                setLogin(false);
                setEmail('');
            }

        } catch (error) {
            Alert.alert("Erro", "problema ao resetar a senha");
        }
    };

    return (
        <LinearGradient
            colors={['#ED145B', '#f4729c']}
            style={styles.container}
        >
            {login ? (
                <Text style={styles.title}>Seja Bem-Vindo!</Text>
            ) : (
                <Text style={styles.titleResetPassword}>Informe o e-mail para recuperação de senha</Text>
            )}

            {login ? (
                <View style={styles.sectionInputs}>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#aaa"
                    />

                    <View style={styles.containerInputPassword}>
                        <TextInput
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            style={styles.inputPassword}
                            placeholder="Senha"
                            placeholderTextColor="#aaa"
                        />
                        <MaterialCommunityIcons
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={24}
                            color="#aaa"
                            style={styles.iconPassword}
                            onPress={toggleShowPassword}
                        />
                    </View>

                </View>
            ) : (
                <View style={styles.sectionInputs}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#aaa"
                    />
                </View>
            )}

            <View style={styles.sectionSubmit}>
                {login ? (
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <MaterialIcons name="meeting-room" size={24} color="#ED145B" style={styles.icon} />
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                        <MaterialIcons name="send" size={24} color="#ED145B" style={styles.icon} />
                        <Text style={styles.buttonText}>Enviar</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.sectionResetPassword}>
                {login ? (
                    <Text style={styles.resetPassword} onPress={() => setLogin(false)}>Esqueceu a Senha ?</Text>
                ) : (
                    <Text style={styles.resetPassword} onPress={() => setLogin(true)}>Cancelar recuperação de senha</Text>
                )}
            </View>

        </LinearGradient >
    );
}

const stylesTeste = (theme: Theme) => {
    return StyleSheet.create({
        containerInputPassword: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 50,
            backgroundColor: "#FFF",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            marginBottom: 16,
            color: "#333",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 8
        },
        inputPassword: {
            flex: 1,
            color: '#333',
            paddingVertical: 10,
            paddingRight: 10,
            fontSize: 16,
        },
        iconPassword: {
            marginLeft: 10,
        },
        headingI: {
            alignItems: 'center',
            fontSize: 20,
            color: 'green',
            marginBottom: 20,
        },
        container: {
            flex: 1,
            justifyContent: "flex-start",
            paddingLeft: 16,
            paddingRight: 16,
            paddingTop: 100
        },
        sectionInputs: {
            flexDirection: "column",
            gap: 8,
            marginTop: 50,
        },
        sectionSubmit: {
            marginTop: 16,
            alignItems: "center",
        },
        sectionResetPassword: {
            marginTop: 50,
            alignItems: "center",
        },
        resetPassword: {
            color: "#FFF",
            textDecorationColor: "#FFF",
            textDecorationLine: "underline",
            fontSize: 18,
            fontWeight: "bold",
        },
        title: {
            fontSize: 30,
            fontWeight: "bold",
            marginBottom: 40,
            textAlign: "center",
            color: "#FFF"
        },
        titleResetPassword: {
            fontSize: 20,
            fontWeight: "bold",
            marginTop: 30,
            marginBottom: 20,
            textAlign: "center",
            color: "#FFF"
        },
        input: {
            height: 50,
            backgroundColor: "#FFF",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 16,
            marginBottom: 16,
            color: "#333",
            // Adicionando sombra
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 8, // Para Android
        },
        button: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#FFF",
            borderRadius: 24,  // Cantos arredondados
            paddingVertical: 12,
            paddingHorizontal: 32,
            // Adicionando sombra
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5, // Para Android
        },
        buttonText: {
            color: theme.colors.primary,
            fontSize: 18,
            fontWeight: "bold",
            marginLeft: 8, // Espaço entre o ícone e o texto
        },
        icon: {
            marginRight: 8,
        },
    });
}

