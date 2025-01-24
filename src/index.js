require('dotenv').config()

const express = require('express')
const bodyparser = require('body-parser')
const AppDataSource = require('./database')

const userRoutes = require('./routes/userRoutes')
const statsRoutes = require('./routes/statsRoutes')

const app = express();
const path = require('path')

const PORT = process.env.PORT || 3010
const HOST = process.env.HOST || "127.0.0.1"

app.use(bodyparser.json())
app.use("/api", userRoutes)
app.use("/api", statsRoutes)

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

AppDataSource.initialize().then(() => {
    app.listen(PORT, () => console.log("Server running on 3005 : http://myshare.haydar.dev/"))
}).catch((error) => {
    console.log("Database err:", error.message)
})