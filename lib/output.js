const chalk = require('chalk');

module.exports = state => {
	const items = [
		'\n',
		chalk.green(` testing (${Object.keys(state).length}) versions of node`),
		'\n'
	];
	// TODO: clean this up
	// TODO: be able to show the current running task with a >
	Object.keys(state).forEach(version => {
		const {
			output,
			error,
			download,
			build,
			clean,
			test
		} = state[version];

		let status;
		let icon;
		let message;

		items.push(['node', `${version}:`, '', ''].join('  '));
		items.push(['', '', '', ''].join('  '));

		if (download.completed === true) {
			status = `${chalk.green('download')} ${chalk.grey(`${parseInt((download.ended - download.started) / 1000) || '0'} seconds`)}`;
			icon = chalk.green('✔');

			items.push([' ', icon, '', status].join('  '));
		} else {
			status = chalk.green('download');
			icon = chalk.grey('◌');

			items.push([' ', icon, '', status].join('  '));
		}

		if (build.completed === true) {
			status = `${chalk.green('build')} ${chalk.grey(`${parseInt((build.ended - build.started) / 1000) || '0'} seconds`)}`;
			icon = chalk.green('✔');

			items.push([' ', icon, '', status].join('  '));
		} else {
			status = chalk.green('build');
			icon = chalk.grey('◌');

			items.push([' ', icon, '', status].join('  '));
		}

		if (test.completed === true) {
			status = `${chalk.green('test')} ${chalk.grey(`${parseInt((test.ended - test.started) / 1000) || '0'} seconds`)}`;
			icon = chalk.green('✔');

			items.push([' ', icon, '', status].join('  '));
		} else {
			status = chalk.green('test');
			icon = chalk.grey('◌');

			items.push([' ', icon, '', status].join('  '));
		}

		if (clean.completed === true) {
			status = `${chalk.green('clean')} ${chalk.grey(`${parseInt((clean.ended - clean.started) / 1000) || '0'} seconds`)}`;
			icon = chalk.green('✔');

			items.push([' ', icon, '', status].join('  '));
			items.push(output.split('\n').map((l) => `	${l}`).join('\n'));
		} else {
			status = chalk.green('clean');
			icon = chalk.grey('◌');

			items.push([' ', icon, '', status].join('  '));
		}

		if (error > '') {
			status = chalk.red('error');
			icon = chalk.red('✖');
			message = `${error} \n ${output}`;

			items.push([' ', icon, '', status].join('  '));
			items.push(message.split('\n').map((l) => `	${l}`).join('\n'));
		}

		items.push(['', '', '', ''].join('  '));
	});

	return items.join('\n');
};
