
const express = require('express')

// use process.env variables to keep private variables,
require('dotenv').config()

// Express Middleware
const helmet = require('helmet') // creates headers that protect from attacks (security)
const bodyParser = require('body-parser') // turns response into usable format
const cors = require('cors')  // allows/disallows cross-site communication
const morgan = require('morgan') // logs requests

// db Connection w/ Heroku
// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   }
// });

// db Connection w/ localhost
// var db = require('knex')({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : '',
//     password : '',
//     database : 'avalondb'
//   }
// });

// db Connection w/ Azure attempt
var db = require('knex')({
  client : 'mssql',
  connection: {
    database: 'avalondb',
    server : 'avalonserver.database.windows.net',
    user : 'azureuser',
    password : 'Avalon#100',
    port: 1433,
    connectionTimeout: 30000,
    options: {
        encrypt: true
    }
  }
});

// Controllers - aka, the db queries
const main = require('./controllers/main')

// App
const app = express()

// App Middleware
// const whitelist = ['http://localhost:3001', 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true)
    // if (whitelist.indexOf(origin) !== -1 || !origin) {
    //   callback(null, true)
    // } else {
    //   callback(new Error('Not allowed by CORS'))
    // }
  }
}
app.use(helmet())
app.use(cors(corsOptions))
app.use(bodyParser.json())
app.use(morgan('combined')) // use 'tiny' or 'combined'

// App Routes - Auth
app.get('/', (req, res) => res.send('hello world'))
app.get('/api/players', (req, res) => main.getTableData(req, res, db))
app.post('/api/players', (req, res) => main.postTableData(req, res, db))
// app.put('/crud', (req, res) => main.putTableData(req, res, db))
// app.delete('/crud', (req, res) => main.deleteTableData(req, res, db))
app.post('/create-new-game', (req, res) => main.createNewGame(req, res, db))

// App Server Connection
app.listen(process.env.PORT || 3001, () => {
  console.log(`Avalon DB connection is running on ${process.env.PORT || 3001}`)
})
