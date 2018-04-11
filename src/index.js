import path from 'path';
import fs from 'fs';
import regex from 'github-short-url-regex';

export default class Broil {
	constructor(repo, target) {
		this.repo = repo;
		this.target = target;
	}

	validateDirectory() {
		if (!this.target) {
			throw new Error('directory not found');
		}

		this.directory = path.join(process.cwd(), this.target);

		if (fs.existsSync(this.directory)) {
			return {status: false, message: 'directory already exists'};
		}

		const message = fs.mkdirSync(this.directory);

		if (!message) {
			return {status: true, message: 'success'};
		}

		return {status: false, message: `could not create directory: ${message}`};
	}

	getUrl() {
		const repoRaw = regex({exact: true}).exec(this.repo)[0];
		const user = repoRaw.split('/')[0];
		const repo = repoRaw.split('/')[1].split('#')[0];
		let branch = repoRaw.split('/')[1].indexOf('#') === 0 ? 'master' : repoRaw.split('/')[1].split('#')[1];

		if (branch === undefined) {
			branch = 'master';
		}

		const url = `https://github.com/${user}/${repo}/archive/${branch}.zip`;

		console.log({
			user, repo, branch, url
		});

		return url;
	}
}
