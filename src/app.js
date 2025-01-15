const express = require("express");
const fs = require("node:fs");
const path = require("node:path");
const MOVIES = require("./data/movies.json");
const { validateMovie } = require("./schemas/movies");

const PORT = process.env.PORT || 8000;

const APP = express();

const modifyMoviesData = (modifiedMovies) =>
  fs.writeFileSync(
    path.join("src", "data", "movies.json"),
    JSON.stringify(modifiedMovies)
  );

APP.use(express.json());
APP.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

APP.get("/movies", (req, res) => {
  const { year, rate, title } = req.query;

  let filteredMovies = MOVIES.filter(
    (movie) =>
      (!year || movie.year == year) &&
      (!rate || movie.rate >= parseFloat(rate)) &&
      (!title || movie.title.toLowerCase().includes(title.toLowerCase()))
  );

  res.json(filteredMovies);
});

APP.get("/movies/:id", (req, res) => {
  const { id } = req.params;

  res.json(MOVIES.find((movie) => movie.id === id));
});

APP.post("/movies", (req, res) => {
  const VALIDATED_MOVIE = validateMovie(req.body);

  if (!VALIDATED_MOVIE.success)
    return res
      .status(400)
      .json({ message: JSON.parse(VALIDATED_MOVIE.error.message) });

  const NEW_MOVIE = { id: crypto.randomUUID(), ...VALIDATED_MOVIE.data };

  MOVIES.push(NEW_MOVIE);

  // Saving new movie in JSON (not REST API. Normally here will be saved in a database)
  modifyMoviesData(MOVIES);

  res.status(201).json(NEW_MOVIE);
});

APP.delete("/movies/:id", (req, res) => {
  const MOVIE_INDEX = MOVIES.findIndex((movie) => movie.id === req.params.id);

  if (MOVIE_INDEX === -1)
    return res.status(404).json({ message: "Movie not found" });

  MOVIES.splice(MOVIE_INDEX, 1);

  modifyMoviesData(MOVIES);

  res.status(204);
});

APP.patch("/movies/:id", (req, res) => {
  const VALIDATED_MOVIE = validateMovie(req.body);

  if (!VALIDATED_MOVIE.success)
    return res
      .status(400)
      .json({ message: JSON.parse(VALIDATED_MOVIE.error.message) });

  const { id } = req.params;

  const MOVIE_INDEX = MOVIES.findIndex((movie) => movie.id === id);

  if (MOVIE_INDEX === -1)
    return res.status(404).json({ message: "Movie not found" });

  const UPDATED_MOVIE = { id, ...VALIDATED_MOVIE.data };

  MOVIES.splice(MOVIE_INDEX, 1, UPDATED_MOVIE);

  modifyMoviesData(MOVIES);

  res.status(200).json(UPDATED_MOVIE);
});

APP.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
