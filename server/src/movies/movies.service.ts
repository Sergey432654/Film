import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { Movie } from './entities/movie.entity.js';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private readonly moviesRepository: Repository<Movie>,
  ) {}

  findAll(): Promise<Movie[]> {
    return this.moviesRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.moviesRepository.findOneBy({ id });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async create(dto: CreateMovieDto): Promise<Movie> {
    await this.assertTitleIsFree(dto.title);
    return this.moviesRepository.save(this.moviesRepository.create(dto));
  }

  async update(id: number, dto: UpdateMovieDto): Promise<Movie> {
    const movie = await this.findOne(id);
    if (dto.title !== undefined) await this.assertTitleIsFree(dto.title, id);

    return this.moviesRepository.save(this.moviesRepository.merge(movie, dto));
  }

  async remove(id: number): Promise<void> {
    const movie = await this.findOne(id);
    await this.moviesRepository.remove(movie);
  }

  private async assertTitleIsFree(title: string, exceptId?: number): Promise<void> {
    const query = this.moviesRepository
      .createQueryBuilder('movie')
      .where('LOWER(movie.title) = LOWER(:title)', { title });

    if (exceptId !== undefined) query.andWhere('movie.id <> :exceptId', { exceptId });

    if (await query.getExists()) {
      throw new ConflictException({
        message: 'This movie is already in the catalogue.',
        errors: { title: 'A movie with this title already exists' },
      });
    }
  }
}
