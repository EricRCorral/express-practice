let movies = [];

const renderMovies = (movies = []) => {
  const MOVIES_NODE = document.getElementById("movies");

  let moviesHTML = "";

  movies.forEach(({ id, title, url, rate, year }) => {
    moviesHTML += `<div style="margin: 5vh auto; width: 400px">
        <div>◽ Id: ${id}</div>
        <div>◽ Title: ${title}</div>
        <div>◽ Year: ${year}</div>
        <div>◽ Rate: ${rate}</div>
        <div>◽ Url: ${url}</div>
        <button onclick="getMovieById('${id}')">Get by id</button>
        <button onclick="deleteMovie('${id}')">Delete</button>
        <button onclick="patchmMovie('${id}')">Patch</button>
      </div>`;
  });

  MOVIES_NODE.innerHTML = moviesHTML;
};

const getAll = async () => {
  const MOVIES = await (await fetch("http://localhost:8000/movies/")).json();
  movies = MOVIES;
  renderMovies(MOVIES);
};

const getMovieById = async (id) => {
  const movie = await (
    await fetch(`http://localhost:8000/movies/${id}`)
  ).json();
  renderMovies([movie]);
};

const postMovie = async () => {
  const INPUTS = document.querySelectorAll("input");

  let body = {};
  INPUTS.forEach(
    ({ value, name }) =>
      (body[name] = name === "year" || name === "rate" ? Number(value) : value)
  );

  const resp = await (
    await fetch("http://localhost:8000/movies/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  ).json();

  if (!!resp.message) {
    alert(resp.message.map(({ message }) => message).join("\n"));
    return;
  }

  getAll();

  INPUTS.forEach((input) => (input.value = null));
};

const deleteMovie = async (id) => {
  const resp = await fetch(`http://localhost:8000/movies/${id}`, {
    method: "DELETE",
  });

  if (!!resp.message) {
    alert(resp.message.map(({ message }) => message).join("\n"));
    return;
  }

  getAll();
};

const patchmMovie = async (id) => {
  const INPUTS = document.querySelectorAll("input");

  let body = {};
  INPUTS.forEach(({ value, name }) => {
    if (!value) return;
    body[name] = name === "year" || name === "rate" ? Number(value) : value;
  });

  body = JSON.stringify({
    ...movies.find((movie) => movie.id === id),
    ...body,
  });

  const resp = await (
    await fetch(`http://localhost:8000/movies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body,
    })
  ).json();

  if (!!resp.message) {
    alert(resp.message.map(({ message }) => message).join("\n"));
    return;
  }

  getAll();

  INPUTS.forEach((input) => (input.value = null));
};
