
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  // save system's color scheme
  const colorScheme = useColorScheme();

  return (
    // apply theme based on system's settings
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {}
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
      {}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
