const path = require('path');

module.exports = {
    type: "mariadb",
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    username : process.env.USERNAME,
    password : process.env.PASSWORD,
    database : process.env.DATABASE,
    entities: [
        path.join(__dirname, 'entities', '*.js'),
      ],
    synchronize : true
}