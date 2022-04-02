import fs from "fs";
import JWT from "jsonwebtoken";
import "dotenv/config";
import fetch from "node-fetch";

// File where is the data about movies
const filePath2 = "./favMovies.json";
// File where is the data about users
const filePath = "./users.json";

const API_KEY = "api_key=77787911a95eb6cc9e954c624d769dd0";

const BASE_URL = "https://api.themoviedb.org/3";

// Popular movies
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&" + API_KEY;

// Get a list of movies
export const searchMovies = (req, res) => {
  // Verify if the given token is valid
  JWT.verify(req.token, process.env.SECRET_KEY, (err, data) => {
    if (err) {
      res.status(403);
    } else {
      getMovies(API_URL).then((data) => res.send(data));
    }
  });
};

// Add a movie to favorite list
export const addMovieToFav = (req, res) => {
  JWT.verify(req.token, process.env.SECRET_KEY, async (err, data) => {
    if (err) {
      // Fordibben
      res.status(403);
    } else {
      // Request the bearer from the header
      const bearerHead = req.headers.authorization;
      // Split the bearer to get the token
      let base64Url = bearerHead.split(".")[1];
      let base64 = base64Url.replace("-", "+").replace("_", "/");
      // Get the payload of the token
      let decodedData = JSON.parse(
        Buffer.from(base64, "base64").toString("binary")
      );
      // Request the id of the movie inside the body
      const movie = req.body.id;
      const url_movie_id = `https://api.themoviedb.org/3/movie/${movie}?${API_KEY}&language=en-US`;
      // fetch the url
      await fetch(url_movie_id)
        .then((res) => res.json())
        .then((data) => {
          if (data.id !== movie) {
            res.status(403).send("Movie not found");
          } else {
            // Read the files for existing movies already
            fs.readFile(filePath2, "utf-8", (err, dataM) => {
              // Convert the data into a Array
              let movies = dataM ? JSON.parse(dataM) : [];
              // Create a variable that contains the fav movie of a user
              let newMovie = ({
                email: decodedData.email,
                id: movie,
                title: data.title,
              });
              // Check if a user already have a movie in his list
              if (movies.find((m) => m.email === newMovie.email)) {
                return res
                  .status(400)
                  .send(`${decodedData.email}, you already have ${data.title} in your favorite list`);
              }
              movies.push(newMovie);
              fs.writeFile(filePath2, JSON.stringify(movies), (err) => {
                res.send(`${decodedData.email} add ${data.title} to his favorite list`);
              });
            });
          }
        });
    }
  });
};

function getMovies(url) {
  return new Promise((resolve) => {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // I use map with object destructuring to select the specific properties that i want
        let result = data.results.map((element) => {
          var suggestionScore = Math.floor(Math.random() * (99 - 0)) + 0;
          return {
            id: element.id,
            title: element.title,
            suggestionScore: suggestionScore
          };
        });
        resolve(result);
      })
      .catch((err) => {
        return err;
      });
  });
}
