<script lang="ts">
    import type {
        AgentCreateSessionResponse,
        AgentRunSessionResponse,
    } from "$lib/types/adk-responses";
    import { getContext } from "svelte";
    import type { AgentRunRequest } from "$lib/types/adk-requests";
    import { type Session } from "$lib/utils/session";

    const sessionStore = getContext<{ current: Session }>("sessionState");
    const session = $derived(sessionStore.current);

    let {
        shoulderRotation = null,
        hipRotation = null,
    }: { shoulderRotation: number | null; hipRotation: number | null } =
        $props();

    let swingAnalysisText: string | undefined = $state();
    let isLoading = $state(false);

    $effect(() => {
        if (shoulderRotation !== null && hipRotation !== null) {
            runAgent(shoulderRotation, hipRotation);
        }
    });

    async function runAgent(shoulder: number, hip: number) {
        swingAnalysisText = undefined;
        isLoading = true;

        try {
            const res = await fetch("/api/session", { method: "POST" });
            if (!res.ok) throw new Error("Failed to create session");
            const sessionData =
                (await res.json()) as AgentCreateSessionResponse;
            session.setSessionInfo(sessionData.id, sessionData.appName);
            // We must sync the userId as well, as the server might have resolved it differently
            if (sessionData.userId) {
                session.setUserId(sessionData.userId);
            }
        } catch (e) {
            console.error("AgentCard: Failed to initialize session", e);
            isLoading = false;
            return;
        }

        const agentRunRequest: AgentRunRequest = {
            appName: session.agentAppName!,
            userId: session.userId!,
            sessionId: session.sessionId!,
            newMessage: {
                role: "user",
                parts: [
                    {
                        text: `Please analyse the following swing metrics: Shoulder rotation ${shoulder} and hip rotation ${hip}`,
                    },
                ],
            },
        };

        try {
            const response = await fetch("/api/run", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(agentRunRequest),
            });

            if (!response.ok) {
                console.error(
                    "Agent run failed",
                    response.status,
                    response.statusText,
                );
                return;
            }

            const decodedResponse =
                (await response.json()) as AgentRunSessionResponse[];

            for (const event of decodedResponse.reverse()) {
                if (event.content.role === "model") {
                    const textPart = event.content.parts.find(
                        (p) => "text" in p,
                    );
                    if (textPart && "text" in textPart) {
                        swingAnalysisText = textPart.text;
                        break;
                    }
                }
            }
        } catch (e) {
            console.error("Error running agent", e);
        } finally {
            isLoading = false;
        }
    }
</script>

<div
    class="bg-theme-surface border border-theme-border rounded-xl p-4 flex flex-col gap-3 min-w-[200px] shadow-md"
>
    <div class="flex justify-between items-center">
        <h4
            class="text-xs font-semibold uppercase tracking-wider text-theme-text-secondary m-0"
        >
            Swing Analysis
        </h4>
        {#if isLoading}
            <div
                class="w-4 h-4 border-2 border-theme-border border-t-theme-accent rounded-full animate-spin"
            ></div>
        {/if}
    </div>

    <div class="text-sm text-theme-text-primary leading-relaxed">
        {#if swingAnalysisText}
            {swingAnalysisText}
        {:else if !isLoading}
            <span class="text-theme-text-secondary italic"
                >Waiting for analysis...</span
            >
        {/if}
    </div>
</div>
