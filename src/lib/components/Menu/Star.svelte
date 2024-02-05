<script lang="ts">
    import './Star.scss';

    const [ size, ...effects ]: string = $$props.class.split(' ');
</script>

<div class="star {size}">
    <div class="center" />
    {#each effects as effect, index (index)}
        <div class="effect-{effect}" />
    {/each}
</div>