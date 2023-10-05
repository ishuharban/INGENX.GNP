const asyncHandler = require("express-async-handler");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization || req.cookies.token;
  console.log("auth Token : ", authHeader);
  if (authHeader) {
    token = authHeader;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      console.log("Validation passed....");
      req.result = decoded.result;
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized token is missing");
    }
  }
});

module.exports = validateToken;
