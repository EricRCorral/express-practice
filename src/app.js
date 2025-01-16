import express, { json } from "express";
import CORSHeaders from "./middlewares/CORSHeaders.js";
import MOVIES_ROUTER from "./routes/movies.js";

const PORT = process.env.PORT || 8000;

const APP = express();

APP.use(json());
APP.use(CORSHeaders);

APP.use("/movies", MOVIES_ROUTER);

APP.listen(PORT, () => {
  console.log(`Server running at port http://localhost:${PORT}`);
});
