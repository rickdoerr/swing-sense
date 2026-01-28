<script lang="ts">
    import { authClient } from "$lib/utils/auth-client";

    let { show = $bindable(false) } = $props<{ show: boolean }>();

    let isSignUp = $state(false);
    let email = $state("");
    let password = $state("");
    let name = $state("");
    let loading = $state(false);
    let error = $state<string | null>(null);

    async function handleAuth() {
        loading = true;
        error = null;
        try {
            if (isSignUp) {
                const { data, error: err } = await authClient.signUp.email({
                    email,
                    password,
                    name,
                });
                if (err) throw err;
            } else {
                const { data, error: err } = await authClient.signIn.email({
                    email,
                    password,
                });
                if (err) throw err;
            }
            show = false;
            // Reset form
            email = "";
            password = "";
            name = "";

            // Reload app so we can trigger a new user ID sync between client and server
            // and also create a new session with the logged in user ID.
            window.location.reload();
        } catch (e: any) {
            error = e.message || "An error occurred";
        } finally {
            loading = false;
        }
    }
</script>

{#if show}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
        <div
            class="w-full max-w-md bg-theme-surface rounded-xl shadow-xl border border-theme-border overflow-hidden"
        >
            <div
                class="px-6 py-4 border-b border-theme-border flex justify-between items-center"
            >
                <h2 class="text-lg font-semibold text-theme-text-primary">
                    {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <button
                    onclick={() => (show = false)}
                    class="text-theme-text-secondary hover:text-theme-text-primary"
                >
                    ✕
                </button>
            </div>

            <div class="p-6 space-y-4">
                {#if error}
                    <div class="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                        {error}
                    </div>
                {/if}

                {#if isSignUp}
                    <div class="space-y-2">
                        <label
                            class="text-sm font-medium text-theme-text-secondary"
                            for="name">Name</label
                        >
                        <input
                            id="name"
                            type="text"
                            bind:value={name}
                            class="input-field"
                            placeholder="Your Name"
                        />
                    </div>
                {/if}

                <div class="space-y-2">
                    <label
                        class="text-sm font-medium text-theme-text-secondary"
                        for="email">Email</label
                    >
                    <input
                        id="email"
                        type="email"
                        bind:value={email}
                        class="input-field"
                        placeholder="you@example.com"
                    />
                </div>

                <div class="space-y-2">
                    <label
                        class="text-sm font-medium text-theme-text-secondary"
                        for="password">Password</label
                    >
                    <input
                        id="password"
                        type="password"
                        bind:value={password}
                        class="input-field"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    onclick={handleAuth}
                    disabled={loading}
                    class="btn btn-primary w-full mt-2"
                >
                    {loading
                        ? "Processing..."
                        : isSignUp
                          ? "Sign Up"
                          : "Sign In"}
                </button>

                <div class="text-center pt-2">
                    <button
                        onclick={() => {
                            isSignUp = !isSignUp;
                            error = null;
                        }}
                        class="text-sm text-theme-text-secondary hover:text-theme-accent hover:underline"
                    >
                        {isSignUp
                            ? "Already have an account? Sign In"
                            : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}
