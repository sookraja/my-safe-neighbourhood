import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.beak.mysafeneighbourhood',
  appName: 'MySafeNeighbourhood',
  webDir: 'out', 
  server: {
    url: 'https://my-safe-neighbourhood.vercel.app',
    cleartext: false,
    allowNavigation: ['https://my-safe-neighbourhood.vercel.app'],
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
