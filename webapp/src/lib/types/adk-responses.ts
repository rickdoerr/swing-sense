/*
    Agent server session response. 
*/
export interface AgentCreateSessionResponse {
    id: string;
    appName: string;
    userId: string;
    state: Record<string, unknown>;
    events: unknown[];
    lastUpdateTime: number;
}

/*
    Agent run request response.
*/
export interface AgentRunSessionResponse {
    content: {
        parts: AgentContentPart[];
        role: "model" | "user";
    };
    invocationId: string;
    author: string;
    actions: {
        stateDelta: Record<string, unknown>;
        artifactDelta: Record<string, unknown>;
        requestedAuthConfigs: Record<string, unknown>;
    };
    longRunningToolIds?: string[];
    id: string;
    timestamp: number;
}

export type AgentContentPart = AgentFunctionCallPart | AgentFunctionResponsePart | AgentTextPart;

export interface AgentFunctionCallPart {
    functionCall: {
        id: string;
        name: string;
        args: Record<string, unknown>;
    };
}

export interface AgentFunctionResponsePart {
    functionResponse: {
        id: string;
        name: string;
        response: Record<string, unknown>;
    };
}

export interface AgentTextPart {
    text: string;
}
