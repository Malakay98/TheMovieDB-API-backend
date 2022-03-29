import fs from "fs";
import JWT from "jsonwebtoken";
import "dotenv/config";
import fetch from "node-fetch";

// File where is the data
const filePath2 = "./favMovies.json";

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
      // Request the id inside the body
      const movie = req.body.id;
      // console.log(movie)
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
              // Create a variable that contains the id in the body and the title of that id
              let newMovie = {
                id: movie,
                title: data.title,
              };
              console.log(movies);
              // Check if the movie already exist
              if (movies.find((m) => m.id === newMovie.id)) {
                return res
                  .status(400)
                  .send(`${data.title} is already in favorite list`);
              }
              movies.push(newMovie);
              // movies.push(data.title);
              fs.writeFile(filePath2, JSON.stringify(movies), (err) => {
                res.send(`Movie ${data.title} added to favorite list`);
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
        // console.log(res);
        return res.json();
      })
      .then((data) => {
        // console.log(data.results);
        function Beetwen() {
          // return an integer value beetwen 1 and 17
          return Math.floor(Math.random() * (17 - 1) + 1);
        }
        for (let movie = 0; movie <= data.results[10].title.length; movie++) {
          let movie1 = data.results[0].title;
          let movie2 = data.results[1].title;
          let movie3 = data.results[3].title;
          let movie4 = data.results[4].title;
          let movie5 = data.results[5].title;
          let movie6 = data.results[6].title;
          let movie7 = data.results[7].title;
          let movie8 = data.results[8].title;
          let movie9 = data.results[9].title;
          let movie10 = data.results[10].title;
          // Return a random movie
          let movieRandom = data.results[Beetwen()].title;
          let allMovies = [
            movie1,
            movie2,
            movie3,
            movie4,
            movie5,
            movie6,
            movie7,
            movie8,
            movie9,
            movie10,
            "Here you have a suggested movie: " + movieRandom,
          ];
          resolve(allMovies);
          console.log("Movie: " + data.results[movie].title);
        }
      })
      .catch((err) => {
        return err;
      });
  });
}
