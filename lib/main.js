const path = require('path');
const fs = require('fs');
const async = require('async');
const logUpdate = require('log-update');

const output = require('./output');
const build = require('./build');
const download = require('./download');
const clean = require('./clean');
const test = require('./test');

const cwd = process.cwd();

module.exports = ({
	versions,
	pkg
}) => {
	const filePath = name => path.join(cwd, name);
	const update = () => logUpdate(output(state));
	const exists = fs.existsSync(filePath('.dockerignore'));
	const state = {};

	// if there's no .dockerignore
	// copy .gitignore to .dockerignore
	if (!exists) {
		fs.createReadStream(filePath('.gitignore')).pipe(fs.createWriteStream(filePath('.dockerignore')));
	}

	return new Promise((resolve, reject) => {
		async.map(versions, (version, callback) => {
			let context = {
				name: pkg.name.toLowerCase(),
				cwd,
				version
			};
			return Promise.resolve(context)
				.then(() => {
					state[version] = {
						output: '',
						error: '',
						download: {
							started: new Date(),
							ended: '',
							completed: false
						},
						build: {
							started: '',
							ended: '',
							completed: false
						},
						clean: {
							started: '',
							ended: '',
							completed: false
						},
						test: {
							started: '',
							ended: '',
							completed: false
						}
					}
					update();
					return context;
				})
				.then(download)
				.then(() => {
					state[version].download.ended = new Date();
					state[version].download.completed = true;
					state[version].build.started = new Date();
					update();
					return context;
				})
				.then(build)
				.then(() => {
					state[version].build.ended = new Date();
					state[version].build.completed = true;
					state[version].test.started = new Date();
					update();
					return context;
				})
				.then(test)
				.then((context) => {
					state[version].test.ended = new Date();
					state[version].output = context.output;
					state[version].test.completed = true;
					state[version].clean.started = new Date();
					update();
					return context;
				})
				.then(clean)
				.then(() => {
					state[version].clean.ended = new Date();
					state[version].clean.completed = true;
					update();
					callback();
				})
				.catch((context) => {
					state[version].error = context.error;
					state[version].output = context.output;
					update();
					callback();
				});
		}, (err) => {
			if (!exists) {
				fs.unlinkSync(filePath('.dockerignore'));
			}
			if (err) return reject(err);
			return resolve(state);
		})
	});
};
