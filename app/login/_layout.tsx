import { Stack } from "expo-router";
import { View } from "react-native";


export default function LoginLayout() {

    return (
        <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
            {/* Stack de navegação */}
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            />
        </View>
    );
}
