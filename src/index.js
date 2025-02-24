require('dotenv').config()

const express = require('express')
const bodyparser = require('body-parser')
const AppDataSource = require('./database')

const userRoutes = require('./routes/userRoutes')
const statsRoutes = require('./routes/statsRoutes')
const notesRoutes = require('./routes/notesRoutes')

const app = express();
const path = require('path')

var errorHandler = require('express-error-handler'),
  handler = errorHandler({
    views: {
      '404': 'https://myshare.haydar.dev/404.html',
      '500': 'https://myshare.haydar.dev/500.html'
    }
  });

const PORT = process.env.PORT || 3010
const HOST = process.env.HOST || "127.0.0.1"

app.use(bodyparser.json())
app.use("/api", userRoutes)
app.use("/api", statsRoutes)
app.use("/api", notesRoutes)

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

AppDataSource.initialize().then(() => {
    app.listen(PORT, () => console.log(`Server running on ${process.env.PORT} : http://myshare.haydar.dev/`))
}).catch((error) => {
    console.log("Database err:", error.message)
})

app.use( errorHandler.httpError(404) );
app.use( errorHandler.httpError(500) );
  

