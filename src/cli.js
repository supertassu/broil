#!/usr/bin/env node

import 'babel-polyfill';
import meow from 'meow';

const cli = meow(`
    Usage
      $ broil --repo <user/repo> --name <target>
 
    Options
      --repo, -r  Specifies the github repository to clone from. (required)
      --name, -n  Specifies the folder to be cloned to.          (required)
      --keep-git  Do not remove .git from cloned repository
 
    Examples
      $ broil -r supertassu/broilerplate -n awesome-project
      $ broil --repo supertassu/broilerplate-electron --name another-awesome-project --keep-git
`, {
	flags: {
		repo: {
			type: 'string',
			alias: 'r'
		},
		name: {
			type: 'string',
			alias: 'n'
		},
		'keep-git': {
			type: 'boolean'
		},
		'skip-exec': {
			type: 'boolean'
		}
	}
});

// Validation

if (!cli.flags.repo) {
	console.error('no repository specified');
	process.exit(1);
} else if (!cli.flags.name) {
	console.error('no target specified');
	process.exit(1);
} else if (Array.isArray(cli.flags.repo)) {
	console.error('multiple repositories specified');
	process.exit(1);
} else if (Array.isArray(cli.flags.name)) {
	console.error('multiple targets specified');
	process.exit(1);
}

// For unit testing
if (cli.flags.skipExec) {
	console.log('success');
	process.exit(0);
}
