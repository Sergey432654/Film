// Must stay in sync with the client: src/api/movies/movies.schemas.ts
export const MIN_YEAR = 1888;
export const MAX_YEAR = new Date().getFullYear() + 5;
export const TITLE_MAX = 120;
export const GENRE_MIN = 2;
export const GENRE_MAX = 40;
export const DESCRIPTION_MAX = 500;
export const GENRE_PATTERN = /^[\p{L}][\p{L}\s&'-]*$/u;
