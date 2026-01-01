import * as k from 'kysely';
import { Pool, types } from 'pg';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DB {}

export async function getDb() {
	types.setTypeParser(types.builtins.NUMERIC, (v) => Number(v));
	types.setTypeParser(types.builtins.INT8, (v) => Number(v));

	const connectionString = await getConnectionString();

	return new k.Kysely<DB>({
		dialect: new k.PostgresDialect({
			pool: new Pool({
				connectionString
			})
		})
	});
}

async function getConnectionString() {
	let connectionString: string;

	const dev = await getDev();

	if (dev) {
		try {
			({ DATABASE_URL: connectionString } = await import('$env/static/private'));
		} catch (_err) {
			connectionString = process.env.DATABASE_URL!;
		}
	} else {
		try {
			const { getRequestEvent } = await import('$app/server');
			const event = getRequestEvent();
			connectionString = event.platform!.env.HYPERDRIVE.connectionString;
		} catch (_err) {
			try {
				({ DATABASE_URL: connectionString } = await import('$env/static/private'));
			} catch (_err) {
				connectionString = process.env.DATABASE_URL!;
			}
		}
	}

	if (!connectionString) {
		throw new Error('Could not find connection string');
	}

	return connectionString;
}

async function getDev() {
	let dev: boolean;
	try {
		({ dev } = await import('$app/environment'));
	} catch (_err) {
		({ DEV: dev } = await import('esm-env'));
	}
	return dev;
}
