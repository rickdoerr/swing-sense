import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = async ({ locals, fetch }) => {
    const userId = locals.resolvedUserId;
    let sessionId: string | undefined;
    let appName: string | undefined;

    try {
        const response = await fetch('/api/session', {
            method: 'POST'
        });

        if (response.ok) {
            const sessionData = await response.json();
            sessionId = sessionData.id;
            appName = sessionData.appName;
        } else {
            console.error(`Failed to create agent session: ${response.status} ${response.statusText}`);
        }
    } catch (e) {
        console.error("Failed to create initial agent session", e);
    }


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
