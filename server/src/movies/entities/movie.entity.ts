import { Exclude, Transform } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { nullToUndefined, numericTransformer } from '../../common/transformers.js';
import { DESCRIPTION_MAX, GENRE_MAX, TITLE_MAX } from '../movies.constants.js';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: TITLE_MAX })
  title: string;

  @Column({ type: 'varchar', length: GENRE_MAX })
  genre: string;

  @Transform(nullToUndefined, { toPlainOnly: true })
  @Column({ type: 'smallint', nullable: true })
  year: number | null;

  @Transform(nullToUndefined, { toPlainOnly: true })
  @Column({
    type: 'numeric',
    precision: 3,
    scale: 1,
    nullable: true,
    transformer: numericTransformer,
  })
  rating: number | null;

  @Transform(nullToUndefined, { toPlainOnly: true })
  @Column({ type: 'varchar', length: DESCRIPTION_MAX, nullable: true })
  description: string | null;

  /** Public URL of the poster in Firebase Storage. */
  @Transform(nullToUndefined, { toPlainOnly: true })
  @Column({ type: 'varchar', nullable: true })
  posterUrl: string | null;

  /** Object path inside the bucket, used to replace or delete the poster. */
  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  posterPath: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
