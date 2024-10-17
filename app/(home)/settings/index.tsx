import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RadioButton, List } from "react-native-paper";
import { Ionicons, MaterialIcons, Foundation, AntDesign } from '@expo/vector-icons';
import { useAppThemeContext } from "@/contexts/ThemeContext";
import { Theme } from "@react-navigation/native";

export default function SettingsScreen() {

    const { theme, toggleTheme, DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

    return (
        <View style={styles.container}>
            {/* Seção de seleção de tema */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tema</Text>

                <View style={styles.radioButtonGroup}>
                    <RadioButton.Group onValueChange={(value) => toggleTheme(value as "light" | "dark")} value={theme} >
                        <View style={styles.radioOption}>
                            <Foundation name="contrast" color={DefaultTheme.colors.primary} size={28} />
                            <Text style={styles.radioText}>Automático</Text>
                            <RadioButton value="automatic" color={DefaultTheme.colors.primary} />
                        </View>
                        <View style={styles.radioOption}>
                            <MaterialIcons name="light-mode" color={DefaultTheme.colors.primary} size={24} />
                            <Text style={styles.radioText}>Claro</Text>
                            <RadioButton value="light" color={DefaultTheme.colors.primary} />
                        </View>
                        <View style={styles.radioOption}>
                            <MaterialIcons name="dark-mode" color={DefaultTheme.colors.primary} size={24} />
                            <Text style={styles.radioText}>Escuro</Text>
                            <RadioButton value="dark" color={DefaultTheme.colors.primary} />
                        </View>
                    </RadioButton.Group>
                </View>

            </View>

            <View style={{ flex: 1 }} />
            {/* Seção de informações técnicas */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Informações do App</Text>
                <List.Item
                    titleStyle={{
                        color: DefaultTheme.colors.text
                    }}
                    descriptionStyle={{
                        color: DefaultTheme.colors.text
                    }}
                    title="Contato"
                    description="fiapgrupo913@gmail.com"
                    left={() => <MaterialIcons name="mail-outline" color={DefaultTheme.colors.primary} size={24} />}
                />
                <List.Item
                    titleStyle={{
                        color: DefaultTheme.colors.text
                    }}
                    descriptionStyle={{
                        color: DefaultTheme.colors.text
                    }}
                    title="Desenvolvedor"
                    description="Grupo 9 Fiap 2024"
                    left={() => <AntDesign name="codesquareo" color={DefaultTheme.colors.primary} size={24} />}
                />
                <List.Item
                    titleStyle={{
                        color: DefaultTheme.colors.text
                    }}
                    descriptionStyle={{
                        color: DefaultTheme.colors.text
                    }}
                    title="Versão"
                    description="1.0.0"
                    left={() => <Ionicons name="information" color={DefaultTheme.colors.primary} size={24} />}
                />
            </View>
        </View>
    );
}

const stylesTeste = (theme: Theme) => {

    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
            backgroundColor: theme.colors.background
        },
        section: {
            marginBottom: 2,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "bold",
            marginBottom: 16,
            color: theme.colors.text
        },
        radioButtonGroup: {
            borderColor: theme.colors.border,
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
            color: theme.colors.text
        }
    });
}

