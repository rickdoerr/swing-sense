<script lang="ts">
    import { authClient } from "$lib/utils/auth-client";
    import AuthModal from "$lib/components/auth/auth-modal.svelte";

    // Session state
    let session = authClient.useSession();

    // Modal state
    let showLoginModal = $state(false);

    async function handleLogout() {
        await authClient.signOut();
    }
</script>

<header
    class="flex items-center justify-between px-6 py-4 bg-theme-surface border-b border-theme-border"
>
    <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold text-theme-text-primary">
            Golf Swing Analyst
        </h1>
    </div>

    <div>
        {#if $session.data}
            <div class="flex items-center gap-4">
                <span class="text-sm text-theme-text-secondary"
                    >{$session.data.user.name}</span
                >
                <button
                    onclick={handleLogout}
                    class="btn btn-secondary px-4 py-2 text-sm"
                >
                    Logout
                </button>
            </div>
        {:else}
            <button
                onclick={() => (showLoginModal = true)}
                class="btn btn-primary px-4 py-2 text-sm"
            >
                Login
            </button>
        {/if}
    </div>
</header>

<AuthModal bind:show={showLoginModal} />
