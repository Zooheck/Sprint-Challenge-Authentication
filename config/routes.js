const axios = require('axios');
const bcrypt = require('bcryptjs')
const { authenticate, generateToken } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

const UserFuncs = require('./models.js');

async function register(req, res) {
  let user = req.body;
  const hashedPassword = bcrypt.hashSync(user.password, 8);
  user.password = hashedPassword;

  try {
    const newUser = await UserFuncs.add(user);

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json(error);
  }
}

async function login(req, res) {
  // implement user login
  let { username, password } = req.body;
  try {
    const user = await UserFuncs.findBy({ username });
    
    if(user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ 
        message: `Welcome, ${user.username}!`,
        token
      })
    } else {
      res.status(401).json({ message: "Invalid credentials."})
    }
  } catch (error) {
    res.status(500).json(error);
  }

}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
