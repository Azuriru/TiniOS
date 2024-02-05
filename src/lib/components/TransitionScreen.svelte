<script lang="ts">
    import { fade } from 'svelte/transition';
    import { fadeIn, fadeOut } from '../util/anim';
    import { transitioning } from '../util/store';
</script>

<div
    class="transition-screen"
    in:fade={fadeIn}
    out:fade={fadeOut}
    on:introend={async () => {
        if (typeof $transitioning === 'function') {
            $transitioning();
        }
    }}
/>

<style lang="scss">
	.transition-screen {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: white;
	}
</style>