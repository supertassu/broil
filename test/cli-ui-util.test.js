import {serial as test} from 'ava';
import {h, renderToString} from 'ink';
import clearModule from 'clear-module';
import stripAnsi from 'strip-ansi';
import {State, Timer} from '../src/cli-ui-util';

// Credits to https://github.com/sindresorhus/ink-big-text/blob/master/test.js
test('render state component', t => {
	process.env.FORCE_COLOR = 0;
	clearModule.all();

	const actual = renderToString(
		<State loadingState="loading" text="unicorns"/>
	);

	t.snapshot(stripAnsi(actual));

	delete process.env.FORCE_COLOR;
});

test('render timer component', t => {
	process.env.FORCE_COLOR = 0;
	clearModule.all();

	const actual = renderToString(
		<Timer/>
	);

	t.snapshot(stripAnsi(actual));

	delete process.env.FORCE_COLOR;
});
