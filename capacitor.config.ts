import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.beak.mysafeneighbourhood',
  appName: 'MySafeNeighbourhood',
  webDir: 'out', 
  server: {
    url: 'https://my-safe-neighbourhood-git-annette-annettes-projects-a6b8faf0.vercel.app',
    cleartext: false,
    allowNavigation: ['my-safe-neighbourhood-git-annette-annettes-projects-a6b8faf0.vercel.app'],
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
