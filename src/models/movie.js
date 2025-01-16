import { writeFileSync } from "node:fs";
import { join } from "node:path";
import MOVIES from '../data/movies.json' with {type: 'json'}

const modifyMoviesData = (modifiedMovies) =>
  writeFileSync(
    join("src", "data", "movies.json"),
    JSON.stringify(modifiedMovies)
  );

export default class MovieModel {
  static getAll = async ({ year, rate, title }) =>
    MOVIES.filter(
      (movie) =>
        (!year || movie.year == year) &&
        (!rate || movie.rate >= parseFloat(rate)) &&
        (!title || movie.title.toLowerCase().includes(title.toLowerCase()))
    );

  static create = ({ data }) => {
    const NEW_MOVIE = { id: crypto.randomUUID(), ...data };

    // Saving new movie in JSON (not REST API. Normally here will be saved in a database)
    MOVIES.push(NEW_MOVIE);
    modifyMoviesData(MOVIES);

    return NEW_MOVIE;
  };

  static getById = async ({ id }) => MOVIES.find((movie) => movie.id === id);

  static delete = async ({ id }) => {
    const MOVIE_INDEX = MOVIES.findIndex((movie) => movie.id === id);

    if (MOVIE_INDEX === -1) return false;

    MOVIES.splice(MOVIE_INDEX, 1);

    modifyMoviesData(MOVIES);
  };

  static update = async ({ id, data }) => {
    const MOVIE_INDEX = MOVIES.findIndex((movie) => movie.id === id);

    if (MOVIE_INDEX === -1) return false;

    const UPDATED_MOVIE = { id, ...data };

    MOVIES.splice(MOVIE_INDEX, 1, UPDATED_MOVIE);

    modifyMoviesData(MOVIES);

    return UPDATED_MOVIE;
  };
}
