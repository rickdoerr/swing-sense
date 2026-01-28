<script lang="ts">
    import { getContext } from "svelte";
    import type { Session } from "$lib/utils/session.svelte";

    const sessionStore = getContext<{ current: Session }>("sessionState");
    let session = $derived(sessionStore.current);

    let isHidden = $state(false);

    function updateUserCookieConsent(isAccepted: boolean) {
        session.setConsent(isAccepted);
        isHidden = true;
    }
</script>

{#if !isHidden && session.consentStatus === "pending"}
    <div
        class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-gray-900/95 backdrop-blur-md text-gray-100 p-6 shadow-2xl z-50 rounded-2xl border border-gray-700/50 flex flex-col gap-4 transition-all duration-500 ease-out transform translate-y-0 opacity-100"
    >
        <div class="flex flex-col gap-2">
            <h3 class="font-semibold text-lg text-white">Cookie Consent</h3>
            <p class="text-sm text-gray-300 leading-relaxed">
                We use cookies solely for session management.
            </p>
        </div>
        <div class="flex items-center justify-end gap-3 pt-2">
            <button
                class="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                onclick={() => updateUserCookieConsent(false)}
            >
                Reject
            </button>
            <button
                class="px-5 py-2 bg-theme-accent hover:bg-theme-accent-light text-white rounded-lg text-sm font-semibold shadow-lg shadow-theme-accent/20 transition-all hover:scale-105 active:scale-95"
                onclick={() => updateUserCookieConsent(true)}
            >
                Accept Selection
            </button>
        </div>
    </div>
{/if}
