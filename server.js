'use strict'
// Requires ---------------------------------------------------------------------------------------------------
let express = require('express')
let path = require('path')

// Variables
let port = process.env.PORT || 8080
let cwd = __dirname || process.cwd()

// Declare server ---------------------------------------------------------------------------------------------
let server = express()

// Config -----------------------------------------------------------------------------------------------------
require('dotenv').config({path: path.join(cwd, '/.env')})

// Middleware -------------------------------------------------------------------------------------------------

// Routes ------------------------------------------------------------------------------------------------------
server.get('/', (req, res, next) => { res.json({message: 'Server listening at port %s', port}) })
server.get('/route', (req, res, next) => { res.json({message: 'Hot reload works'}) })

// Server up ---------------------------------------------------------------------------------------------------
server.listen(port, () => { console.log('Server listening at port %s', port) })
