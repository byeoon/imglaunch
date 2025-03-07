require('dotenv').config()

const express = require('express')
const bodyparser = require('body-parser')
const AppDataSource = require('./database')
const bcrypt = require('bcrypt') // not sure if this is still needed here
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const userRoutes = require('./routes/userRoutes')
const statsRoutes = require('./routes/statsRoutes')
const notesRoutes = require('./routes/notesRoutes')

const userRepo = AppDataSource.getRepository("User")

const app = express();
const path = require('path')
const http = require('http');
const url = require('url');

/* 
var errorHandler = require('express-error-handler'),
  handler = errorHandler({
    views: {
      '404': 'https://myshare.haydar.dev/404.html',
      '500': 'https://myshare.haydar.dev/500.html'
    }
  });
*/

var transporter = nodemailer.createTransport({
  service:'Gmail', // ?
  auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_PASSWORD
 }
});

const PORT = process.env.PORT || 3010
const HOST = process.env.HOST || "127.0.0.1"

app.use(bodyparser.json())
app.use("/api", userRoutes)
app.use("/api", statsRoutes)
app.use("/api", notesRoutes)

app.use(express.static(path.join(__dirname, '..', 'public')));


// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

AppDataSource.initialize().then(() => {
    app.listen(PORT, () => console.log(`Server running on ${process.env.PORT} : http://myshare.haydar.dev/`))
}).catch((error) => {
    console.log("Database err:", error.message)
})



const verifyToken = (req, res, next) => {  
  const token = req.headers['Authorization'];
  if (!token) {
    console.log(req.headers);
      console.log("Not signed in with a token.");
    return res.status(401).json({ error: 'Unauthorized' });
  }
    jwt.verify(token, 'secret', (err, decoded) => {
      if (err) {
        console.log("Invalid token.");
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      console.log("Valid token, " + decoded);
      next();
    });
};

app.get('/api/email', verifyToken, async (req, res) => {
  const token = req.headers['Authorization'];
    try {
        const user = await userRepo.findOneBy({ email: req.user.email });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ email: user.email });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
});
  
// TODO: this is a proof of concept
function sendRecoveryEmail(specifiedEmail) {
  var mail = {
    from: process.env.EMAIL_NAME,
    to: specifiedEmail,
    subject: 'MyShare Account Recovery',
    text:'You have requested to recover your account details.'
}
}

