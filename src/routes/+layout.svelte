<script lang="ts">
    import './styles.css';
</script>

<svelte:head>
    <title>Tini</title>
</svelte:head>

<div class="main-screen">
    <slot />
</div>

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