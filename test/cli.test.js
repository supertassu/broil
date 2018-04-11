import 'babel-polyfill';
import test from 'ava';
import execa from 'execa';

test('error when no repo is specified', async t => {
	const err = await t.throws(execa('babel-node', ['src/cli.js', '--skip-exec', '--target', 'randomTarget']));
	t.regex(err.message, /no repository specified/);
});

test('error when no target is specified', async t => {
	const err = await t.throws(execa('babel-node', ['src/cli.js', '--skip-exec', '--repo', 'supertassu/randomRepo']));
	t.regex(err.message, /no target specified/);
});

test('error when multiple targets are specified', async t => {
	const err = await t.throws(execa('babel-node', ['src/cli.js', '--skip-exec', '--repo', 'supertassu/randomRepo', '-t', 'target1', '-t', 'target2']));
	t.regex(err.message, /multiple targets specified/);
});

test('error when multiple repositories are specified', async t => {
	const err = await t.throws(execa('babel-node', ['src/cli.js', '--skip-exec', '--repo', 'supertassu/randomRepo', '-r', 'supertassu/anotherRepo', '-t', 'target']));
	t.regex(err.message, /multiple repositories specified/);
});

test('error when repository name is invalid', async t => {
	const err = await t.throws(execa('babel-node', ['src/cli.js', '--skip-exec', '--repo', 'randomGithubRepository', '-t', 'target']));
	t.regex(err.message, /repository name is not valid/);
});

test('no errors when arguments are valid', async t => {
	const result = await execa('babel-node', ['src/cli.js', '--skip-exec', '--repo', 'supertassu/randomRepo', '-t', 'target']);
	t.truthy(result);
	t.regex(result.stdout, /success/);
});
