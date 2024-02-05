<script lang="ts">
    import './styles.css';
    // import { beforeNavigate, onNavigate } from '$app/navigation';
    import { transitioning, onKeydown } from '$lib/util/store';
    import { /* Screen, */ TransitionScreen } from '$lib/components';

// let transitioned: Promise<void>;

	// beforeNavigate(async nav => {
	// 	const { to, from } = nav;

	// 	if (to?.route.id === from?.route.id) {
	// 		nav.cancel();
	// 		return;
	// 	};

	// 	transitioned = new Promise((res) => transitioning.set(res));
	// });

	// onNavigate(async () => {
	// 	await transitioned;
	// 	transitioning.set(null);
	// });
</script>

<svelte:head>
    <title>Noe</title>
</svelte:head>

<svelte:window on:keydown={$onKeydown} />

<div class="main-screen">
    <slot />
</div>

{#if $transitioning}
    <TransitionScreen />
{/if}

<style lang="scss">
	.main-screen {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: black;
	}
</style>