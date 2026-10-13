import { registerAs, type ConfigType } from '@nestjs/config';

export const firebaseConfig = registerAs('firebase', () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // In .env the key is stored on one line with literal "\n" sequences.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

  return {
    enabled: Boolean(projectId && clientEmail && privateKey && storageBucket),
    projectId,
    clientEmail,
    privateKey,
    storageBucket,
  };
});

export type FirebaseConfig = ConfigType<typeof firebaseConfig>;
