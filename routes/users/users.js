import express from "express";
import { createUser, loginUser, searchAllUsers, logoutUser, validateJWT} from "../../controllers/users.js";

const router = express.Router();

// Every route here start with /users
// Search for all users
router.get("/", searchAllUsers);

// Create a new user
router.post("/", createUser);

// Login of the user
router.post("/login", loginUser);

// Logout
router.patch("/logout", validateJWT, logoutUser);


export default router;
