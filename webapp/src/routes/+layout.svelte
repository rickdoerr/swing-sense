<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";
	import CookieConsent from "$lib/components/cookie-consent.svelte";
	import { Session } from "$lib/utils/session";
	import { setContext } from "svelte";
	import Header from "$lib/components/header.svelte";

	let { children, data } = $props();
	let sessionStore = $state({
		current: new Session(data),
	});

	setContext("sessionState", sessionStore);

	$effect(() => {
		sessionStore.current = new Session(data);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="min-h-screen bg-theme-background text-theme-text-primary font-sans antialiased selection:bg-theme-accent selection:text-white"
>
	<Header />
	{@render children()}
	<CookieConsent />
</div>
