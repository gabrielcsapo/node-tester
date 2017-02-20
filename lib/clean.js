'use strict';

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const removeFile = (path) => {
	return new Promise((resolve, reject) => {
		fs.unlink(path, (err) => {
			if (err) {
				return reject(err);
			}
			return resolve();
		});
	});
};

module.exports = context => {
	const image = `test-${context.name}-${context.version}`;
	const options = {
		cwd: context.cwd
	};

	return removeFile(path.join(context.cwd, `.${context.version}.dockerfile`))
		.then(() => {
			return new Promise((resolve, reject) => {
				exec(`docker rmi ${image}`, options, (error) => {
					if (error) return reject(error);
					return resolve();
				});
			});
		})
};
