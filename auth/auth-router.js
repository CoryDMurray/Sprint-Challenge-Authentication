const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const db = require('./db-methods');
const jwtKey = require('../authkey')

router.post('/register', (req, res) => {
  // implement registration
  let user = req.body
  const hash = bcrypt.hashSync(user.password, 12);
  user.password = hash;

  db.addUser(user)
    .then(id => {
      res.status(201).json(id);
    })
    .catch(err => {
      res.status(500).json({message:'Unable to register :( '})
    })
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;
  console.log({ username })
  db.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = createToken(user);

        res.status(200).json({
          message: `ようこそ ${user.username}`,
          token: token
        });
      } else {
        res.status(401).json({ message: 'you have failed the vibe check' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Error you must DIE', err });
      console.log(err)
    });
});

function createToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }
  const options = {
    expiresIn: '1h'
  }

  const token = jwt.sign(payload,  jwtKey.Key, options );
  return token
}

module.exports = router;
