const functions = require('firebase-functions');

const express = require('express');
const engines = require('consolidate');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

app.engine('hbs', engines.handlebars);
app.set('views', ['./overlays']);
app.set('view engine', 'hbs');

const MAX_INPUT_LENGTH = 100;

function validateOrThrow(params) {
	for (const key in params) {
		if (params[key] && params[key].length > MAX_INPUT_LENGTH) {
			throw new Error(`Invalid value at key ${key}`);
		}
	}
}
// hosting for overlay-tools
app.get('/camera-glow', (req, res) => {

	validateOrThrow(req.query);
	validateOrThrow(req.params);

	if (!req.query.channel) {
		return res.status(500).send('channel param required');
	}
	const data = req.query;
	data.color1 = data.color1 || 'transparent';
	data.color2 = data.color2 || 'transparent';
	data.color3 = data.color3 || 'transparent';
	data.shape = data.shape || 'round';
	data.width = data.width || 182;
	data.height = data.height || 182;
	data.halfWidth = data.height / 2;
	data.halfHeight = data.height / 2;

	res.render('camera-glow/index', data);
});


app.get('/voice', (req, res) => {

	validateOrThrow(req.query);
	validateOrThrow(req.params);

	if (!req.query.channel) {
		return res.status(500).send('channel param required');
	}
	res.render('voice/index', req.query);
});

app.post('/voice', (req, res) => {
	console.log(req.body);
	res.json({ channel: req.body.channel, id: '42' });
});

exports.app = functions.https.onRequest(app);
