/*
    Agent server run request.
*/
export interface AgentRunRequest {
    appName: string;
    userId: string;
    sessionId: string;
    newMessage: AgentRunMessage;
}

export interface AgentRunMessage {
    role: string;
    parts: { text: string }[];
}