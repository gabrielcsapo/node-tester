const spawn = require('child_process').spawn;

module.exports = context => {
	const image = `test-${context.name}-${context.version}`;
	const env = process.env; // pass the process environment variables to the docker image

	const args = [
		'run',
		'--rm'
	];

	Object.keys(env).forEach(key => {
		const value = env[key];

		args.push('-e', `${key}=${value}`);
	});

	args.push(image, 'npm', 'test');

	return new Promise((resolve, reject) => {
		const test = spawn(`docker`, args);
		context.output = '';
		context.error = '';

		test.stdout.on('data', (data) => {
			context.output += `${data}\n`;
		});

		test.stderr.on('data', (data) => {
			context.error += `${data}\n`;
		});

		test.on('close', (code) => {
			if (code !== 0) {
				reject(context);
			}
			resolve(context);
		});
	});
};
