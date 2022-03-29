import express from "express"
import {searchMovies, addMovieToFav} from "../../controllers/movies.js";
import { validateToken } from "../../controllers/users.js";

const router = express.Router();

// All routes here start with /movies
router.get('/', validateToken, searchMovies)

router.post('/', validateToken, addMovieToFav)

export default router;