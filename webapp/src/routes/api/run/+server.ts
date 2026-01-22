import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import type { AgentRunRequest } from '$lib/types/adk-requests';
import type { AgentRunSessionResponse } from '$lib/types/adk-responses';

export const POST: RequestHandler = async ({ request }) => {
    const baseURL = env.AGENT_BASE_URL || 'http://127.0.0.1:8000';

    let clientRequest: AgentRunRequest;

    try {
        clientRequest = (await request.json()) as AgentRunRequest;
    } catch {
        throw error(400, 'Invalid JSON in request body!');
    }

    const url = `${baseURL}/run`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientRequest)
    });

    if (!response.ok) {
        const bodyText = await response.text().catch(() => '');
        throw error(
            response.status,
            `Failed to call Agent server: ${bodyText || response.statusText}`
        );
    }

    const decodedResponse = (await response.json()) as AgentRunSessionResponse[];

    return json(decodedResponse);
}
