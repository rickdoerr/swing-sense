import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const { consent, userId } = await request.json();

    if (consent === 'accepted' || consent === 'rejected') {
        const isAccepted = consent === 'accepted';

        cookies.set('gu_consent', consent, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365
        });

        // If accepted and we have a userId, persist the user identity.
        // This is for situations in which annonymous users transition to logged in accounts.
        if (isAccepted) {
            // Check for existing anonymous ID or generate a new one
            // We DO NOT want to use the passed in userId if it's an authenticated ID
            // Ideally, we should have read the cookie, but if it's missing, we start a new anonymous chain.
            const anonymousId = cookies.get('gu_id') || crypto.randomUUID();

            cookies.set('gu_id', anonymousId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: true,
                maxAge: 60 * 60 * 24 * 365
            });
        }

        return json({ success: true });
    }

    return json({ success: false }, { status: 400 });
};
