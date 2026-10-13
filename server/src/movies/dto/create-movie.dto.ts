import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { trim, trimToUndefined } from '../../common/transformers.js';
import {
  DESCRIPTION_MAX,
  GENRE_MAX,
  GENRE_MIN,
  GENRE_PATTERN,
  MAX_YEAR,
  MIN_YEAR,
  TITLE_MAX,
} from '../movies.constants.js';

// Messages mirror the client form so server errors read the same next to the fields.
export class CreateMovieDto {
  @Transform(trim)
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(TITLE_MAX, { message: `Title must be at most ${TITLE_MAX} characters` })
  title: string;

  @Transform(trim)
  @IsString({ message: 'Genre must be a string' })
  @Length(GENRE_MIN, GENRE_MAX, {
    message: `Genre must be between ${GENRE_MIN} and ${GENRE_MAX} characters`,
  })
  @Matches(GENRE_PATTERN, {
    message: 'Genre can contain only letters, spaces, “&”, “-” and “’”',
  })
  genre: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Year must be a whole number' })
  @Min(MIN_YEAR, { message: `Year must be ${MIN_YEAR} or later` })
  @Max(MAX_YEAR, { message: `Year must be ${MAX_YEAR} or earlier` })
  year?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 1 },
    { message: 'Rating must be a number with at most one decimal place' },
  )
  @Min(0, { message: 'Rating must be between 0 and 10' })
  @Max(10, { message: 'Rating must be between 0 and 10' })
  rating?: number;

  @Transform(trimToUndefined)
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(DESCRIPTION_MAX, {
    message: `Description must be at most ${DESCRIPTION_MAX} characters`,
  })
  description?: string;
}
