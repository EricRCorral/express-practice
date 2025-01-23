import validateMovie from "../schemas/movies.js";

// Local DB
// import MovieModel from "../models/local/movie.js";

// MySQL DB
import MovieModel from "../models/mysql/movies.js";

export default class MovieController {
  static getAll = async (req, res) => {
    const { year, rate, title } = req.query;
    const FILTERED_MOVIES = await MovieModel.getAll({ year, rate, title });

    res.json(FILTERED_MOVIES);
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    const MOVIE = await MovieModel.getById({ id });
    if (!MOVIE) {
      res.status(404).json({ message: "Movie not found" });
      return;
    }
    res.json(MOVIE);
  };

  static post = async (req, res) => {
    const VALIDATED_MOVIE = validateMovie(req.body);

    if (!VALIDATED_MOVIE.success)
      return res
        .status(400)
        .json({ message: JSON.parse(VALIDATED_MOVIE.error.message) });

    const NEW_MOVIE = await MovieModel.create(VALIDATED_MOVIE);

    res.status(201).json(NEW_MOVIE);
  };

  static delete = async (req, res) => {
    const RESULT = await MovieModel.delete({ id: req.params.id });

    if (RESULT === false) {
      res.status(404).send();
      return;
    }

    res.status(204).send();
  };

  static patch = async (req, res) => {
    const { success, data, error } = validateMovie({
      ...req.body,
      rate: Number(req.body.rate),
    });

    if (!success)
      return res.status(400).json({ message: JSON.parse(error.message) });

    const { id } = req.params;

    const RESULT = await MovieModel.update({
      id,
      data,
    });

    if (RESULT === false) {
      res.status(404).send();
      return;
    }

    res.status(204).send();
  };
}
