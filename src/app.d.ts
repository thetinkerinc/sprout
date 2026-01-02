/// <reference types="svelte-clerk/env" />

declare global {
	namespace App {
		interface Platform {
			env: {
				HYPERDRIVE: {
					connectionString: string;
				};
			};
		}
	}
}

export {};
