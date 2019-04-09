// This script copies src/index.html into /dist/index.html
// This is a good example of using Node and cheerio to do a simple file transformation.
// In this case, the transformation is useful since we only use a separate css file in prod.
import fs from 'fs';
import cheerio from 'cheerio';
import colors from 'colors';

/*eslint-disable no-console */

fs.readFile('src/index.html', 'utf8', (err, markup) => {
	if (err) {
		return console.log(err);
	}

	const $ = cheerio.load(markup);
	// since a separate spreadsheet is only utilized for the production build, need to dynamically add this here.

	const head = $('head');
	head.children().last()
		.after('<link rel="stylesheet" href="/styles.css" type="text/css" />');
	const body = $('body');
	body.children().last()
		.before('<script src="/assets/jquery.slimscroll.min.js"></script>')
		.before('<script src="/assets/jquery.blockui.min.js"></script>')
		.before('<script src="/assets/bootstrap-switch.min.js"></script>')
		.before('<script src="/assets/datatables.min.js"></script>')
		.before('<script src="/assets/datatables.bootstrap.js"></script>')
		.before('<script src="/assets/tableHeadFixer.js"></script>');

	fs.writeFile('dist/index.html', $.html(), 'utf8', function (err) {
		if (err) {
			return console.log(err);
		}
		console.log('index.html written to /dist'.green);
	});
});
