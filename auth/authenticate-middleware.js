const jwt = require("jsonwebtoken")
const jwtKey = require('../authkey')

/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if(token) {
    jwt.verify(token, jwtKey, (err, decodedToken) => {
      if(err) {
        res.status(401).json({ you: "thats a negative ghost rider "})
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    })
  } else {
    res.status(401).json({ you: 'shall not pass!'})
  }
};
