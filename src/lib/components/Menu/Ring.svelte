<script lang="ts">
    import './Ring.scss';
</script>

<div class="ring {$$props.class}">
    <slot />
</div>

<style lang="scss">
    .ring {
        position: absolute;
    }
</style>