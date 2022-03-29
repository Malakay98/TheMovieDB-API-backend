import express from "express";
import { v4 as uuidv4 } from "uuid";
import fs, { existsSync, readFile } from "fs";
import JWT from "jsonwebtoken";
import "dotenv/config";

// File where is the data
const filePath = "./users.json";

const Regex =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export const searchAllUsers = (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.log(`Error: ${err}`);
    }
    res.end(`Here all users: ${data}`);
  });
};

// Register
export const createUser = (req, res, next) => {
  const user = req.body;
  // We use the uuid module that provides an id automatically
  const ids = uuidv4();
  // Save the data that comes from the client
  let newUser = {
    id: ids,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    password: user.password,
  };

  // Verify if all inputs are full
  if (
    newUser.email == undefined ||
    newUser.firstName == undefined ||
    newUser.lastName == undefined ||
    newUser.password == undefined
  ) {
    res.status(400).json("All the inputs are required");
  }
  // Verify if a email is acceptabel or not using Regex
  const validateEmail = newUser.email;
  if (!Regex.test(validateEmail)) {
    return res.status(400).json("The email is not valid");
  }

  // validates whether the password meets the requirements
  if (newUser.password.length <= 5) {
    return res.status(400).json("The password need more than 5 characters");
  }

  // First read existing users.
  fs.readFile(filePath, "utf-8", (err, data) => {
    // Convert the data inside the filepath into a object, else equals to an empty object
    let users = data ? JSON.parse(data) : [];
    console.log(users);
    // Check if email is already in use
    if (users.find((u) => u.email === newUser.email)) {
      return res.status(400).send("Email already in use, try again");
    }
    users.push(newUser);
    fs.writeFile(filePath, JSON.stringify(users), (err) => {
      if (err) throw err;
      res.send(
        `User ${newUser.lastName} ${newUser.firstName} created successfully`
      );
    });
  });
};

// Login
export const loginUser = (req, res) => {
  // Require the email and password that was send it from the client
  const { email, password } = req.body;
  const user = { email: email, password: password };
  // Call the function that generate the Token
  const tokenAcces = generateAccessToken(user);
  // Read the existing users
  fs.readFile(filePath, "utf-8", (err, data) => {
    let users = data ? JSON.parse(data) : [];
    // Find if a user meets the requirements
    if (
      users.find((u) => u.email === user.email && u.password === user.password)
    ) {
      return res.header("authorization", tokenAcces).json({
        message: "Login successful!",
        token: tokenAcces,
      });
    } else {
      res.status(400).send("User doesn't exist");
    }
    console.log(user.email);
    console.log(user.password);
  });
};

// Logout
export const logoutUser = (req, res) => {
  const bearerHead = req.headers.authorization;
  const bearer = bearerHead.split(" ")[1];
  console.log(bearer);
  JWT.sign(bearer, " ", { expiresIn: 1 }, (logout, err) => {
    if (logout) {
      res.send({ msg: "You have been Logged Out" });
    } else {
      res.send({ msg: "Error" });
    }
  });
};

// Create token for the logged user
function generateAccessToken(user) {
  return JWT.sign(user, process.env.SECRET_KEY, { expiresIn: "15m" });
}

// Validate the token for the user interactions
// Authorization: Bearer <token>
export function validateToken(req, res, next) {
  // Get auth header value
  const bearerHead = req.headers["authorization"];
  if (typeof bearerHead === "undefined" || bearerHead.length !== 204) {
    // Forbidden
    res.status(403).json("You don't have permission to access, you're TOKEN is invalid");
  } else {
    // Split at the space
    const bearer = bearerHead.split(" ");
    // Get token from the array
    const bearerToken = bearer[1];
    // Se the token
    req.token = bearerToken;
    // Next middleware
    next();
  }
}
