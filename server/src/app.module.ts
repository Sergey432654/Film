import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { appConfig } from './config/app.config.js';
import { databaseConfig, type DatabaseConfig } from './config/database.config.js';
import { validateEnv } from './config/env.validation.js';
import { firebaseConfig } from './config/firebase.config.js';
import { FirebaseModule } from './firebase/firebase.module.js';
import { MoviesModule } from './movies/movies.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', '.env'],
      load: [appConfig, databaseConfig, firebaseConfig],
      validate: validateEnv,
    }),
    TypeOrmModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (db: DatabaseConfig) => ({
        type: 'postgres',
        host: db.host,
        port: db.port,
        username: db.username,
        password: db.password,
        database: db.database,
        autoLoadEntities: true,
        synchronize: db.synchronize,
      }),
    }),
    FirebaseModule,
    MoviesModule,
  ],
  providers: [{ provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor }],
})
export class AppModule {}
