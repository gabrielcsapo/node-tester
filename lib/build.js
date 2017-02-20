'use strict';

const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const writeFile = (path, content, type) => {
	return new Promise((resolve, reject) => {
		fs.writeFile(path, content, type, (err) => {
			if (err) {
				return reject(err);
			}
			return resolve();
		});
	});
}

module.exports = context => {
	const dockerfile = `FROM node:${context.version}-onbuild`;
	const tmpPath = path.join(context.cwd, `.${context.version}.dockerfile`);

	const image = `test-${context.name}-${context.version}`;
	const options = {
		cwd: context.cwd
	};


	return writeFile(tmpPath, dockerfile, 'utf8')
		.then(() => {
			return new Promise((resolve, reject) => {
				exec(`docker build -t ${image} -f ${tmpPath} .`, options, (error) => {
					if (error) return reject(error);
					return resolve();
				});
			});
		})
};
