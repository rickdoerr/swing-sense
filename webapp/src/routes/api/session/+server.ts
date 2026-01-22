import type { RequestHandler } from './$types';
import type { AgentCreateSessionResponse } from '$lib/types/adk-responses';
import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ locals }) => {
    const baseURL = env.AGENT_BASE_URL || 'http://127.0.0.1:8000';

    // We expect the user ID to be resolved by hooks and available in locals.
    // loops guaranteed to set resolvedUserId.
    const userId = locals.resolvedUserId;

    // We must create a new agent session for each browser session, 
    // which includes app refresh, or reload. 
    const sessionId = crypto.randomUUID();

    const url = `${baseURL}/apps/agent/users/${userId}/sessions/${sessionId}`;

    const response = await fetch(url, {
        method: 'POST'
    });

    if (!response.ok) {
        const bodyText = await response.text().catch(() => '');
        throw error(
            response.status,
            `Failed to call Agent server: ${bodyText || response.statusText}`
        );
    }

    const decodedResponse = (await response.json()) as AgentCreateSessionResponse;

    return json(decodedResponse);
};
