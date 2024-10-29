import { AuthProvider } from '@/contexts/AuthContext';
import { AppThemeProvider } from '@/contexts/ThemeContext';
import { LightTheme } from '@/themes/Light';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const systemColorScheme = useColorScheme();

  const setStatusBarColor = () => {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor(LightTheme.colors.primary);
    StatusBar.setBarStyle('light-content', true);
  }

  useEffect(() => {
    setStatusBarColor();
  }, [systemColorScheme]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
