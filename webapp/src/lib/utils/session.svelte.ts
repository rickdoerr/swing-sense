export type ConsentStatus = 'unknown' | 'pending' | 'accepted' | 'rejected';

export class Session {
    constructor(data?: App.PageData) {
        if (data) {
            this.sync(data);
        }
    }

    sync(data: App.PageData) {
        this.consentStatus_ = data.consent;
        this.userId_ = data.resolvedUserId || undefined;
        // Only overwrite if server provides a value, preserving client-side created sessions
        if (data.agentSessionId) {
            this.sessionId_ = data.agentSessionId;
        }
        this.agentAppName_ = data.agentAppName;
    }

    async setConsent(accepted: boolean) {
        const status = accepted ? 'accepted' : 'rejected';
        this.consentStatus_ = status;

        await fetch('/api/consent', {
            method: 'POST',
            body: JSON.stringify({
                consent: status,
                userId: this.userId_
            }),
            headers: { 'content-type': 'application/json' }
        });
    }

    async create() {
        if (this.sessionId_) return;

        try {
            const res = await fetch("/api/session", { method: "POST" });
            if (!res.ok) throw new Error("Failed to create session");
            // We need to import the type or just use any/unknown if strict types aren't available in this file context easily without massive imports
            // For now, I'll rely on the structure matching what we know.
            // Ideally we import AgentCreateSessionResponse but I need to check imports.
            const sessionData = await res.json();

            this.setSessionInfo(sessionData.id, sessionData.appName);
            if (sessionData.userId) {
                this.setUserId(sessionData.userId);
            }
        } catch (e) {
            console.error("Session: Failed to initialize session", e);
        }
    }

    get consentStatus(): ConsentStatus {
        return this.consentStatus_;
    }

    get sessionId(): string | undefined {
        return this.sessionId_;
    }

    get userId(): string | undefined {
        return this.userId_;
    }

    get agentAppName(): string | undefined {
        return this.agentAppName_;
    }

    setSessionInfo(sessionId: string, appName: string) {
        this.sessionId_ = sessionId;
        this.agentAppName_ = appName;
    }

    setUserId(userId: string) {
        this.userId_ = userId;
    }

    private consentStatus_ = $state<ConsentStatus>('unknown');
    private sessionId_ = $state<string | undefined>();
    private userId_ = $state<string | undefined>();
    private agentAppName_ = $state<string | undefined>();
}
