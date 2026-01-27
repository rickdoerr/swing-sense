import { env } from '$env/dynamic/private';

export async function createAgentSession(userId: string) {
    const baseURL = env.AGENT_BASE_URL || 'http://127.0.0.1:8000';
    const sessionId = crypto.randomUUID();

    const response = await fetch(`${baseURL}/apps/agent/users/${userId}/sessions/${sessionId}`, {
        method: 'POST'
    });

    if (!response.ok) {
        throw new Error(`Failed to create agent session: ${response.statusText}`);
    }

    return await response.json();
}
