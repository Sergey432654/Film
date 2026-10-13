import { Global, Logger, Module } from '@nestjs/common';
import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';

import { firebaseConfig, type FirebaseConfig } from '../config/firebase.config.js';

import { FIREBASE_APP } from './firebase.constants.js';
import { FirebaseStorageService } from './firebase-storage.service.js';

const APP_NAME = 'film';

@Global()
@Module({
  providers: [
    {
      provide: FIREBASE_APP,
      inject: [firebaseConfig.KEY],
      useFactory: (config: FirebaseConfig): App | null => {
        if (!config.enabled) {
          new Logger('Firebase').warn('Firebase is not configured, file storage is disabled.');
          return null;
        }

        const existing = getApps().find((app) => app.name === APP_NAME);
        if (existing) return existing;

        return initializeApp(
          {
            credential: cert({
              projectId: config.projectId,
              clientEmail: config.clientEmail,
              privateKey: config.privateKey,
            }),
            storageBucket: config.storageBucket,
          },
          APP_NAME,
        );
      },
    },
    FirebaseStorageService,
  ],
  exports: [FIREBASE_APP, FirebaseStorageService],
})
export class FirebaseModule {}
