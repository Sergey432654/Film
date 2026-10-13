import { Inject, Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { App } from 'firebase-admin/app';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';

import { FIREBASE_APP } from './firebase.constants.js';

export interface UploadFile {
  buffer: Buffer;
  mimetype: string;
}

export interface StoredFile {
  /** Object path inside the bucket, keep it to replace or delete the file later. */
  path: string;
  /** Public download URL to return to the client. */
  url: string;
}

/**
 * Thin wrapper over Firebase Cloud Storage. Not used by any module yet;
 * intended for movie posters (see `Movie.posterUrl` / `Movie.posterPath`).
 */
@Injectable()
export class FirebaseStorageService {
  constructor(@Inject(FIREBASE_APP) private readonly app: App | null) {}

  get isEnabled(): boolean {
    return this.app !== null;
  }

  async upload(file: UploadFile, path: string): Promise<StoredFile> {
    const object = this.bucket().file(path);
    await object.save(file.buffer, { contentType: file.mimetype, resumable: false });
    return { path, url: await getDownloadURL(object) };
  }

  async delete(path: string): Promise<void> {
    await this.bucket().file(path).delete({ ignoreNotFound: true });
  }

  private bucket() {
    if (!this.app) throw new ServiceUnavailableException('File storage is not configured.');
    return getStorage(this.app).bucket();
  }
}
