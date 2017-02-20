'use strict';

const exec = require('child_process').exec;

module.exports = context => {
	const image = `node:${context.version}-onbuild`;

	return new Promise((resolve, reject) => {
		exec(`docker pull ${image}`, (error) => {
			if(error) return reject(error);
			return resolve();
		});
	});
};
