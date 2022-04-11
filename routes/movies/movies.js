import express from "express"
import {searchMovies, addMovieToFav} from "../../controllers/movies.js";
import { validateToken, validateJWT } from "../../controllers/users.js";

const router = express.Router();

// All routes here start with /movies
router.get('/', validateJWT, searchMovies)

router.post('/', validateJWT, addMovieToFav)

export default router;