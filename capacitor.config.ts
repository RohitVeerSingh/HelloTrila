import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'HelloTrila',
  webDir: 'www',
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library',
      iosIsEncryption: false,
      androidIsEncryption: false,
      webStore: {
        // Ensure web store is configured
        useWebStore: true
      }
    },
  },
};

export default config;
