require('dotenv').config()

const express = require('express')
const bodyparser = require('body-parser')
const AppDataSource = require('./database')

const userRoutes = require('./routes/userRoutes')
const statsRoutes = require('./routes/statsRoutes')
const notesRoutes = require('./routes/notesRoutes')

var cons = require('consolidate');

const app = express();
const path = require('path')

const PORT = process.env.PORT || 3010
const HOST = process.env.HOST || "127.0.0.1"

app.use(bodyparser.json())
app.use("/api", userRoutes)
app.use("/api", statsRoutes)
app.use("/api", notesRoutes)

app.use(express.static(path.join(__dirname, 'public')));

app.engine('html', cons.swig)
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

app.use(function(req, res, next) {
    res.status(404);
    if (req.accepts('.html')) {
      res.render('404', { url: "https://myshare.haydar.dev/404.html" });
      return;
    }
  });

