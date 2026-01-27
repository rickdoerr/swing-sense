// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: import("better-auth").User | null;
			userSession: import("better-auth").Session | null;
			anonymousId: string | null;
			consent: 'accepted' | 'rejected' | 'pending';
			sessionId?: string;
			appName?: string;
			agentSessionId?: string;
			agentAppName?: string;
			resolvedUserId: string;
		}
		interface PageData {
			user: import("better-auth").User | null;
			userSession: import("better-auth").Session | null;
			anonymousId: string | null;
			consent: 'accepted' | 'rejected' | 'pending';
			sessionId?: string;
			appName?: string;
			agentSessionId?: string;
			agentAppName?: string;
			resolvedUserId: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
