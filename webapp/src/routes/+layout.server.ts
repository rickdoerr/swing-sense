import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    const userId = locals.resolvedUserId;

    return {
        user: locals.user,
        session: locals.session,
        anonymousId: locals.anonymousId,
        consent: locals.consent,
        resolvedUserId: userId
    };
};
