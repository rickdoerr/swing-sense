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
        if (isAccepted && userId) {
            cookies.set('gu_id', userId, {
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
