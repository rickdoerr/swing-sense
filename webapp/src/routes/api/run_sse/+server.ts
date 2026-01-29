import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';
import type { AgentRunSSERequest } from '$lib/types/adk-requests';

export const POST: RequestHandler = async ({ request }) => {
    const baseURL = env.AGENT_BASE_URL || 'http://127.0.0.1:8000';

    let clientRequest: AgentRunSSERequest;

    try {
        clientRequest = (await request.json()) as AgentRunSSERequest;
    } catch (e) {
        console.error("Failed to parse request JSON:", e);
        throw error(400, 'Invalid JSON in request body!');
    }

    const url = `${baseURL}/run_sse`;
    console.log(`Forwarding request to Agent: ${url}`);

    // Forward the request to the agent server
    const agentResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Forward any other necessary headers?
        },
        body: JSON.stringify(clientRequest)
    });

    if (!agentResponse.ok) {
        const bodyText = await agentResponse.text().catch(() => '');
        console.error(`Agent server returned error: ${agentResponse.status} ${bodyText}`);
        throw error(
            agentResponse.status,
            `Failed to call Agent server: ${bodyText || agentResponse.statusText}`
        );
    }

    // Return a streaming response
    return new Response(agentResponse.body, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
};
