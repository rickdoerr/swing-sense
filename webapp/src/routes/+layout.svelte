<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import "../app.css";
	import CookieConsent from "$lib/components/cookie-consent.svelte";
	import { Session } from "$lib/utils/session.svelte";
	import { setContext, onMount } from "svelte";
	import Header from "$lib/components/header.svelte";

	let { children, data } = $props();
	let sessionStore = $state({
		current: new Session(data),
	});

	setContext("sessionState", sessionStore);

	onMount(() => {
		sessionStore.current.sync(data);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="min-h-screen bg-theme-background text-theme-text-primary antialiased selection:bg-theme-accent selection:text-white overflow-x-hidden"
>
	<Header />
	{@render children()}
	<CookieConsent />
</div>
