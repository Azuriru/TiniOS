<script lang="ts">
    import { goto } from '$app/navigation';

    export let name: string;
    export let deg: number;
    export let route: string;

    function onClick() {
        goto(route);
    }
</script>

<button on:click={onClick} class="option deg-{deg}">
    {name}
</button>