<script lang="ts">
    import './index.scss';
    import Screen from '../Screen.svelte';
</script>

<Screen name="menu">
    <div class="rings">
        <slot name="rings" />
    </div>
    <div class="options">
        <slot name="options" />
    </div>
    <div class="centerpiece">
        <slot />
    </div>
    <slot name="others" />
</Screen>