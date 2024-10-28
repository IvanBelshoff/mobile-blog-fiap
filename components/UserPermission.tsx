import { useAppThemeContext } from "@/contexts/ThemeContext";
import { IThemeMaximized } from "@/globalInterfaces/interfaces";
import { View, Image, StyleSheet, Text } from "react-native";


export default function UserPermission({ nome, url }: { nome: string, url: string }) {

    const { DefaultTheme } = useAppThemeContext();

    const styles = stylesTeste(DefaultTheme);

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', gap: 20, paddingLeft: 16, alignItems: 'center', backgroundColor: DefaultTheme.colors.primary }}>
            <Image
                source={{ uri: url }} // Mostra a imagem selecionada ou a atual
                style={styles.profileImage}
            />
            <Text style={styles.titleUser}>{nome}</Text>
        </View>
    )
}

const stylesTeste = (theme: IThemeMaximized) => {

    return StyleSheet.create({
        profileImage: {
            width: 75,
            height: 75,
            borderRadius: 8, // Redonda
            marginBottom: 8,
            borderColor: '#FFF',
            borderWidth: 2,
        },
        titleUser: {
            fontSize: 25,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 4,
            color: '#FFF'
        },
    });
}