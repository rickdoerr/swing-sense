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
        this.sessionId_ = data.agentSessionId;
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

    private consentStatus_: ConsentStatus = 'unknown';
    private sessionId_: string | undefined;
    private userId_: string | undefined;
    private agentAppName_: string | undefined;
}
