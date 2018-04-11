#!/usr/bin/env node

import 'babel-polyfill';
import meow from 'meow';
import regex from 'github-short-url-regex';
import {Component, h, render, Text} from 'ink';
import {State, Timer} from './cli-ui-util';
import {createWriteStream} from 'fs';
import request from 'request';
import path from 'path';
import Broil from '..';

const cli = meow(`
    Usage
      $ broil --repo <user/repo> --name <target>
 
    Options
      --target, -t  Specifies the github repository to clone from. (required)
      --repo,   -r    Specifies the folder to be cloned to.        (required)
      --keep-git  Do not remove .git from cloned repository
 
    Examples
      $ broil -r supertassu/broilerplate -t awesome-project
      $ broil --repo supertassu/broilerplate-electron --target another-awesome-project --keep-git
`, {
	flags: {
		repo: {
			type: 'string',
			alias: 'r'
		},
		target: {
			type: 'string',
			alias: 't'
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
} else if (!cli.flags.target) {
	console.error('no target specified');
	process.exit(1);
} else if (Array.isArray(cli.flags.repo)) {
	console.error('multiple repositories specified');
	process.exit(1);
} else if (Array.isArray(cli.flags.target)) {
	console.error('multiple targets specified');
	process.exit(1);
} else if (!regex({exact: true}).test(cli.flags.repo)) { // Figure out how to add webstorm ignore comment without angering xo :P
	console.error('repository name is not valid');
	process.exit(1);
}

// For unit testing
// noinspection JSUnresolvedVariable
if (cli.flags.skipExec) {
	console.log('success');
	process.exit(0);
}

class Broiler extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			mkdir: {
				state: 'waiting',
				err: null
			},
			download: {
				state: 'waiting',
				err: null,
				time: null
			},
			extract: {
				state: 'waiting',
				err: null
			},
			cleanup: {
				state: 'waiting',
				err: null
			}
		};
	}

	render() {
		return (
			<div>
				<State loadingState={this.state.mkdir.state} text="Creating directory..." error={this.state.mkdir.err}/>
				<State loadingState={this.state.download.state} text="Downloading files..." error={this.state.download.err} info={this.state.download.time}/>
				<State loadingState={this.state.extract.state} text="Extracting files..." error={this.state.extract.err}/>
				<State loadingState={this.state.cleanup.state} text="Cleaning up..." error={this.state.cleanup.err}/>
				<br/>
				<Text green><Timer/> seconds elapsed</Text>
			</div>
		);
	}

	componentDidMount() {
		setTimeout(async () => {
			const broil = new Broil(cli.flags.repo, cli.flags.target);

			this.setState({
				mkdir: {
					state: 'loading',
					err: null
				}
			});

			const {status, message} = broil.validateDirectory();

			if (status !== true) {
				this.setState({
					mkdir: {
						state: 'failed',
						err: message
					}
				});

				setTimeout(() => {
					process.exit(1);
				}, 500);

				return;
			}

			this.setState({
				mkdir: {
					state: 'success',
					err: 'success'
				},
				download: {
					state: 'loading',
					err: null
				}
			});

			const file = await createWriteStream(path.join(broil.directory, 'download.zip'));
			request(broil.getUrl()).pipe(file);

			console.log('downloaded');
		}, 250);
	}
}

render((
	<div>
		<Broiler/>
	</div>
));
