import { error } from '@sveltejs/kit';
import { makeCommander } from '@thetinkerinc/commander';

import { getDb } from '../db';

type Commander<T> = ReturnType<typeof makeCommander<Promise<T>>>;
type Db = Awaited<ReturnType<typeof getDb>>;

export const Anonymous: Commander<{ db: Db }> = makeCommander(async () => {
	const db = await getDb();
	return {
		db
	};
});

export const Authenticated: Commander<{ userId: string; db: Db }> = makeCommander(
	async ({ event }) => {
		const { userId } = event.locals.auth();
		if (!userId) {
			error(403, "You don't have permission to perform this action");
		}
		const db = await getDb();
		return {
			userId,
			db
		};
	}
);
