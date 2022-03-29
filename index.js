// Import packages
import express from "express";

import usersRoutes from "./routes/users/users.js";
import moviesRoutes from "./routes/movies/movies.js"

const app = express();
const HTTP_PORT = process.env.PORT || 4000;

// For bodies that have UTF-8 encoding.
app.use(express.urlencoded({ extended: true }));

// Parse json
app.use(express.json());

// Setup the api users routes
app.use("/users", usersRoutes);

// Setup the api movies routes
app.use("/movies", moviesRoutes);

app.use((req, res) => {
  res.status(404);
});

app.listen(HTTP_PORT, () => {
  console.log(
    `Server running on port ${HTTP_PORT}. URL: http://localhost:${HTTP_PORT} ` +
      new Date()
  );
});
  
