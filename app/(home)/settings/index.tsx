import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RadioButton, List } from "react-native-paper";
import { Ionicons, MaterialIcons, Foundation, AntDesign } from '@expo/vector-icons';
import { useAppThemeContext } from "@/contexts/ThemeContext";

export default function SettingsScreen() {

    const { theme, toggleTheme, DefaultTheme } = useAppThemeContext();

    return (
        <View style={styles.container}>
            {/* Seção de seleção de tema */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tema</Text>

                <View style={styles.radioButtonGroup}>
                    <RadioButton.Group onValueChange={(value) => toggleTheme(value as "light" | "dark")} value={theme} >
                        <View style={styles.radioOption}>
                            <Foundation name="contrast" color={DefaultTheme.colors.primary} size={24} />
                            <Text style={styles.radioText}>Automático</Text>
                            <RadioButton value="automatic" />
                        </View>
                        <View style={styles.radioOption}>
                            <MaterialIcons name="light-mode" color={DefaultTheme.colors.primary} size={24} />
                            <Text style={styles.radioText}>Claro</Text>
                            <RadioButton value="light" />
                        </View>
                        <View style={styles.radioOption}>
                            <MaterialIcons name="dark-mode" color={DefaultTheme.colors.primary} size={24} />
                            <Text style={styles.radioText}>Escuro</Text>
                            <RadioButton value="dark" />
                        </View>
                    </RadioButton.Group>
                </View>

            </View>

            <View style={{ flex: 1 }} />
            {/* Seção de informações técnicas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações do App</Text>
                <List.Item
                    title="Contato"
                    description="grupo913@gmail.com"
                    left={() => <MaterialIcons name="mail-outline" color={DefaultTheme.colors.primary} size={24} />}
                />
                <List.Item
                    title="Desenvolvedor"
                    description="Grupo 9 Fiap 2024"
                    left={() => <AntDesign name="codesquareo" color={DefaultTheme.colors.primary} size={24} />}
                />
                <List.Item
                    title="Versão"
                    description="1.0.0"
                    left={() => <Ionicons name="information" color={DefaultTheme.colors.primary} size={24} />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    section: {
        marginBottom: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 16,
    },
    radioButtonGroup: {
        borderColor: '#000',
        borderWidth: 1,
        padding: 25,
        borderRadius: 20,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    radioText: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
});

