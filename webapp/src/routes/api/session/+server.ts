import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { createAgentSession } from '$lib/server/agent-session';

export const POST: RequestHandler = async ({ locals }) => {
    const userId = locals.resolvedUserId;
    const session = await createAgentSession(userId);

    return json(session);
};
