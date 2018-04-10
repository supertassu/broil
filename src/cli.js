#!/usr/bin/env node

import 'babel-polyfill';
import meow from 'meow';
import regex from 'github-short-url-regex';
import {Component, h, render, Text} from 'ink';
import Spinner from 'ink-spinner';
import PropTypes from 'prop-types';
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

/**
 * Possible loadingState values: waiting, loading, success, failed
 */
class State extends Component {
	render() {
		if (this.props.loadingState === 'waiting') {
			return (
				<div>
					<Text orange>·</Text> {this.props.text}
				</div>
			);
		}

		if (this.props.loadingState === 'loading') {
			return (
				<div>
					<Spinner yellow/> {this.props.text}
				</div>
			);
		}

		if (this.props.loadingState === 'success') {
			return (
				<div>
					<Text green>✔</Text> {this.props.text}
				</div>
			);
		}

		return (
			<div>
				<Text red>✖</Text> {this.props.text}
			</div>
		);
	}
}

State.propTypes = {
	loadingState: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired
};

render((
	<div>
		<State loadingState="waiting" text="Waiting.."/>
		<State loadingState="success" text="Another loader."/>
		<State loadingState="loading" text="A moment.."/>
		<State loadingState="failed" text="It failed."/>
	</div>
));

const broiler = new Broil(cli.flags.repo);

console.log(broiler);
