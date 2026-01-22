import { building } from '$app/environment';
import { auth } from '$lib/utils/auth';
import { svelteKitHandler } from "better-auth/svelte-kit";
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

const authHandle: Handle = async ({ event, resolve }) => {
    return svelteKitHandler({ event, resolve, auth, building });
};

const sessionHandle: Handle = async ({ event, resolve }) => {
    const session = await auth.api.getSession({
        headers: event.request.headers
    });

    // This runs on the server first. We can call a follow up sync from the client before we make a request to the agent. 
    // If user is logged in, we populate locals
    // if user is not logged in, but we have a cookie, populate it from a cookie
    // if the user is not known and is pending, leave as null
    // if the user has rejected cookies, leave as null
    // /api/session handles a null state and creates a userID just for this session

    event.locals.session = session?.session || null;
    event.locals.user = session?.user || null;

    // Consent Logic
    const consent = event.cookies.get('gu_consent');
    if (consent === 'accepted' || consent === 'rejected') {
        event.locals.consent = consent;
    } else {
        event.locals.consent = 'pending';
    }

    // Identity Resolution
    // 1. Authenticated User
    // 2. Existing Anonymous Cookie
    // 3. New Anonymous ID
    let resolvedUserId = event.locals.user?.id;

    if (!resolvedUserId) {
        const cookieId = event.cookies.get('gu_id');
        if (cookieId) {
            resolvedUserId = cookieId;
        } else {
            resolvedUserId = crypto.randomUUID();
        }
    }

    event.locals.resolvedUserId = resolvedUserId;
    event.locals.anonymousId = !event.locals.user ? resolvedUserId : null;

    const response = await resolve(event);

    // Persist Anonymous ID if allowed
    // Only set the cookie if:
    // 1. We have a "new" anonymous ID that needs saving (or we want to refresh an existing one)
    // 2. Consent is explicitly ACCEPTED
    // 3. The user is NOT authenticated (auth handles its own session)
    if (!event.locals.user && event.locals.consent === 'accepted') {
        response.headers.append('set-cookie', event.cookies.serialize('gu_id', resolvedUserId, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 60 * 60 * 24 * 365 // 1 year
        }));
    }

    return response;
};

export const handle = sequence(authHandle, sessionHandle);
