import express from 'express';
import path from 'path';
import open from 'open';
import compression from 'compression';
import * as url from './config';
/*eslint-disable no-console */

// const port = 5057;
const app = express();

app.use(compression());

// app.use(function (req, res, next) {
//   if (req.secure) {
//     next();
//   } else {
//     res.redirect('https://' + req.headers.host + req.url);
//   }
// });

app.get('*',function(req,res,next){
	if(req.headers['x-forwarded-proto']!='https')
		res.redirect('https://' + req.headers.host + req.url);
	else
		next(); /* Continue to other routes if we're not redirecting */
});

app.use(express.static('dist'));

app.get('*.js', function (req, res, next) {
	req.url = req.url + '.gz';
	res.set('Content-Encoding', 'gzip');
	next();
});




app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(url.PRODUCTION_PORT, function (err) {
	if (err) {
		console.log(err);
	} else {
		open(url.PRODUCTION_URL + ':' + url.PRODUCTION_PORT);
	}
});
