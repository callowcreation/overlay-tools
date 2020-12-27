const functions = require('firebase-functions');

const express = require('express');
const engines = require('consolidate');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true }));

app.engine('hbs', engines.handlebars);
app.set('views', ['./overlays']);
app.set('view engine', 'hbs');


// hosting for overlay-tools
app.get('/camera-glow', (req, res) => {

	const qs = require('querystring');
	const url = req.url.split('?')[1];
	const req_data = qs.parse(url);
	const { channel, command, color1, color2, color3 } = req_data;
	if (!channel) {
		return res.status(500).send('channel param required');
	}
	res.render('camera-glow/index', {
		channel: channel,
		command: command,
		color1: color1 || 'transparent',
		color2: color2 || 'transparent',
		color3: color3 || 'transparent'
	});
});


app.get('/voice', (req, res) => {

	const qs = require('querystring');
	const url = req.url.split('?')[1];
	const req_data = qs.parse(url);
	const { channel, trigger } = req_data;
	if (!channel) {
		return res.status(500).send('channel param required');
	}
	res.render('voice/index', {
		channel: channel,
		trigger: trigger || 'command'
	});
});

app.post('/voice', (req, res) => {
	console.log(req.body);
	res.json({ channel: req.body.channel, id: '42' });
});

exports.app = functions.https.onRequest(app);
