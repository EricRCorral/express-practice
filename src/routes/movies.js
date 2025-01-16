import { Router } from "express";
import MovieController from "../controllers/movies.js";

const MOVIES_ROUTER = Router();

MOVIES_ROUTER.get("/", MovieController.getAll);
MOVIES_ROUTER.post("/", MovieController.post);
MOVIES_ROUTER.get("/:id", MovieController.getById);
MOVIES_ROUTER.delete("/:id", MovieController.delete);
MOVIES_ROUTER.patch("/:id", MovieController.patch);

export default MOVIES_ROUTER;
