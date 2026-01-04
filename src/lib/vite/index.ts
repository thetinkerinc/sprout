import { execSync } from 'node:child_process';

import type { Plugin } from 'vite';

export function sprout(): Plugin {
	let registered = false;

	function shutdown(exit: boolean) {
		return () => {
			try {
				execSync('docker compose down', { stdio: 'ignore' });
			} catch (_err) {} // eslint-disable-line no-empty
			if (exit) {
				process.exit();
			}
		};
	}

	return {
		name: 'sprout',
		apply: 'serve',
		configureServer() {
			if (registered) {
				return;
			}
			registered = true;
			process.on('SIGINT', shutdown(true));
			process.on('SIGTERM', shutdown(true));
			process.on('exit', shutdown(false));
		}
	};
}
