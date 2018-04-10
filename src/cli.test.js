import 'babel-polyfill';
import test from 'ava';
import execa from 'execa';

test('error when no repo is specified', async t => {
	const err = await t.throws(execa('babel-node', ['src/cli.js', '--name', 'randomTarget']));
	t.regex(err.message, /no repository specified/);
});

test('error when no target is specified', async t => {
	const err = await t.throws(execa('babel-node', ['src/cli.js', '--repo', 'supertassu/randomRepo']));
	t.regex(err.message, /no target specified/);
});

test('error when multiple targets are specified', async t => {
	const err = await t.throws(execa('babel-node', ['src/cli.js', '--repo', 'supertassu/randomRepo', '-n', 'target1', '-n', 'target2']));
	t.regex(err.message, /multiple targets specified/);
});

test('error when multiple repositories are specified', async t => {
	const err = await t.throws(execa('babel-node', ['src/cli.js', '--repo', 'supertassu/randomRepo', '-r', 'supertassu/anotherRepo', '-n', 'target']));
	t.regex(err.message, /multiple repositories specified/);
});
