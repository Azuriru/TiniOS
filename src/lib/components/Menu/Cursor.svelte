<script lang="ts">
    export let angle: number;
    export let onTransitionEnd: (event: TransitionEvent) => void;
</script>

<div class="cursor" style:transform="rotate({angle}deg)" on:transitionend={onTransitionEnd}>
    <div class="star-select">
        <div class="center" />
        {#each [23, 29, 35, 41] as size (size)} 
            <div class="ring size-{size}" />
        {/each}
        <div class="spinner dotted-rounded-wider opacity-7" />
    </div>
</div>