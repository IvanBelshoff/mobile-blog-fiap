import { AuthProvider } from '@/contexts/AuthContext';
import { AppThemeProvider } from '@/contexts/ThemeContext';
import { LightTheme } from '@/themes/Light';
import { Theme } from '@react-navigation/native';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { DarkTheme } from '@/themes/Dark';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [theme, setTheme] = useState<Theme>(LightTheme);
  const systemColorScheme = useColorScheme();

  const getTheme = () => {
    if (systemColorScheme === "light") {
      return LightTheme;
    } else {
      return DarkTheme;
    }
  };

  useEffect(() => {
    setTheme(getTheme());
  }, [systemColorScheme]);

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar
        barStyle={'light-content'}
        backgroundColor={theme.colors.primary}
        translucent={true}
        animated={true}
      />

      <AppThemeProvider>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(home)" />
            <Stack.Screen name="login" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthProvider>
      </AppThemeProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0
  }
});
