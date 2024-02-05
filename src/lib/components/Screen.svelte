<script lang="ts">
    export let name = '';
    export let column: 0 | 1 = 0;
    export let safe: 0 | 1 = 1;
    export let align: 0 | 1 | 2 = 1;
    export let justify: 0 | 1 | 2 | 3 | 4 | 5 = 1;

    const isSafe = (string: string) => safe ? `safe ${string}` : string;
    const ALIGN_TYPES = ['start', 'center', 'end'];
    const JUSTIFY_TYPES = ['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly'];
</script>

<div
    class="{name} screen"
    style:flex-direction={column ? 'column' : ''}
    style:justify-content={isSafe(JUSTIFY_TYPES[justify])}
    style:align-items={isSafe(ALIGN_TYPES[align])}
>
    <slot />
</div>

<style lang="scss">
    .screen {
        display: flex;
        width: 100%;
        height: 100%;
    }
</style>