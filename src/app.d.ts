declare global {
	namespace App {
		interface Platform {
			env: {
				HYPERDRIVE: {
					connectionString: string;
				}
			}
		}
	}
}

export {};
