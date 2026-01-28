

export interface AgentRunSSERequest {
    appName: string;
    userId: string;
    sessionId: string;
    newMessage: AgentRunSSERequestMessage;
    streaming: boolean;
}

export interface AgentRunSSERequestMessage {
    role: string;
    parts: AgentRunSSERequestPart[];
}

export type AgentRunSSERequestPart = { text: string } | { inlineData: { displayName: string; data: string; mimeType: string } };