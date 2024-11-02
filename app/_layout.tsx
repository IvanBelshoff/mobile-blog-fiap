import { AuthProvider } from '@/contexts/AuthContext';
import { AppThemeProvider } from '@/contexts/ThemeContext';
import { LightTheme } from '@/themes/Light';
import 'react-native-reanimated';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { useEffect } from 'react';

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    overflow: 'hidden',
  }
});
