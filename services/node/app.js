/**
 * Starting point of the application.
 *
 * @author mhammarstedt
 * @version 1.18.0
 */

const express = require('express');
const bodyParser = require('body-parser');

let app = express(),
	port = process.env.PORT || 3000;

/**
 * Parsing
 */ 
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: true, type: 'application/json' }));


/**
 * Routes
 */
app.use('/test', (req, res) => {
	res.send('Testsida');
});

app.use('*', (req, res) => {
	res.send('Hello World!');
});


/**
 * Launch the server
 */
app.listen(port, () => {
	console.log('Listening on port ' + port);
});