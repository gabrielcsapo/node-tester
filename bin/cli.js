#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const main = require('../lib/main');
const pkg = require(path.resolve(process.cwd(), 'package.json'));

program
  .version(pkg.version)
  .option('-v, --versions <*, *, *>', 'Specify the versions you want to run against', function(version, versions) {
    versions.push(version);
    return versions;
  }, [])
  .parse(process.argv);

if(!program.versions) {
	throw new Error('please include the versions you want to test');
}
// TODO: get the versions from the node engine in package.json (if it exists)

main({ pkg, versions: program.versions })
	.then(state => {
		const error = Object.keys(state).filter(version => state[version].error);

		process.exit(error.length > 0 ? 1 : 0);
	})
	.catch(err => {
		console.log(err.stack); // eslint-disable-line
		process.exit(1);
	});
