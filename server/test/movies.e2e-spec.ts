import { ClassSerializerInterceptor, type INestApplication } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';

import { createValidationPipe } from '../src/common/validation.pipe.js';
import { Movie } from '../src/movies/entities/movie.entity.js';
import { MoviesController } from '../src/movies/movies.controller.js';
import { MoviesService } from '../src/movies/movies.service.js';

/** In-memory stand-in for the TypeORM repository, so the API is tested without Postgres. */
function createRepositoryMock() {
  let rows: Movie[] = [];
  let nextId = 1;

  const toEntity = (data: Partial<Movie>) => Object.assign(new Movie(), data);

  return {
    reset: () => {
      rows = [];
      nextId = 1;
    },
    find: async () => [...rows].sort((a, b) => a.id - b.id),
    findOneBy: async ({ id }: { id: number }) => rows.find((m) => m.id === id) ?? null,
    create: (data: Partial<Movie>) => toEntity(data),
    merge: (movie: Movie, data: Partial<Movie>) => Object.assign(movie, data),
    save: async (movie: Movie) => {
      if (!movie.id) {
        Object.assign(movie, {
          id: nextId++,
          year: movie.year ?? null,
          rating: movie.rating ?? null,
          description: movie.description ?? null,
          posterUrl: null,
          posterPath: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        rows.push(movie);
      }
      return movie;
    },
    remove: async (movie: Movie) => {
      rows = rows.filter((m) => m.id !== movie.id);
      return movie;
    },
    createQueryBuilder: () => {
      let title = '';
      let exceptId: number | undefined;
      const qb = {
        where: (_: string, params: { title: string }) => ((title = params.title), qb),
        andWhere: (_: string, params: { exceptId: number }) => ((exceptId = params.exceptId), qb),
        getExists: async () =>
          rows.some((m) => m.title.toLowerCase() === title.toLowerCase() && m.id !== exceptId),
      };
      return qb;
    },
  };
}

describe('Movies API', () => {
  let app: INestApplication;
  const repository = createRepositoryMock();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: repository },
        { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });

  beforeEach(() => repository.reset());

  afterAll(async () => {
    await app.close();
  });

  const api = () => request(app.getHttpServer());

  it('creates a movie, trims strings and omits empty optional fields', async () => {
    const res = await api()
      .post('/api/movies')
      .send({ title: '  Inception ', genre: 'Sci-Fi', rating: 8.8, description: '   ' })
      .expect(201);

    expect(res.body).toMatchObject({ id: 1, title: 'Inception', genre: 'Sci-Fi', rating: 8.8 });
    expect(res.body).not.toHaveProperty('year');
    expect(res.body).not.toHaveProperty('description');
    expect(res.body).not.toHaveProperty('posterPath');
  });

  it('answers 422 with field errors in the client format', async () => {
    const res = await api()
      .post('/api/movies')
      .send({ title: '', genre: '1', year: 1700, rating: 8.85, extra: true })
      .expect(422);

    expect(res.body.message).toBe('Some fields are invalid.');
    expect(Object.keys(res.body.errors).sort()).toEqual(
      ['extra', 'genre', 'rating', 'title', 'year'].sort(),
    );
    expect(res.body.errors.title).toBe('Title is required');
  });

  it('rejects a duplicate title case-insensitively with 409', async () => {
    await api().post('/api/movies').send({ title: 'Up', genre: 'Adventure' }).expect(201);

    const res = await api().post('/api/movies').send({ title: 'UP', genre: 'Drama' }).expect(409);

    expect(res.body.errors).toEqual({ title: 'A movie with this title already exists' });
  });

  it('lists, reads, updates and deletes', async () => {
    await api().post('/api/movies').send({ title: 'Coco', genre: 'Animation' }).expect(201);

    await api()
      .get('/api/movies')
      .expect(200)
      .expect((res) => expect(res.body).toHaveLength(1));

    await api()
      .patch('/api/movies/1')
      .send({ rating: 8.4 })
      .expect(200)
      .expect((res) => expect(res.body).toMatchObject({ title: 'Coco', rating: 8.4 }));

    await api().delete('/api/movies/1').expect(204);
    await api().get('/api/movies/1').expect(404);
  });

  it('allows keeping the same title on update', async () => {
    await api().post('/api/movies').send({ title: 'Shrek', genre: 'Comedy' }).expect(201);
    await api().patch('/api/movies/1').send({ title: 'shrek' }).expect(200);
  });

  it('rejects a non-numeric id with 400', async () => {
    await api().get('/api/movies/abc').expect(400);
  });
});
