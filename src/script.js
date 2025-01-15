(async () => {
  const resp = await (await fetch("http://localhost:8000/movies/")).json();
  console.log(resp);
})();
