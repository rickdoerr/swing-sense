import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = async ({ locals, fetch }) => {
    const userId = locals.resolvedUserId;
    const sessionId = locals.agentSessionId;
    const appName = locals.agentAppName;

    return {
        user: locals.user,
        userSession: locals.userSession,
        anonymousId: locals.anonymousId,
        consent: locals.consent,
        resolvedUserId: userId,
        sessionId,
        appName
    };
};
