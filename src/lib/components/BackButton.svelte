<script lang="ts">
    import { goto } from '$app/navigation';
    import { t } from '$lib/i18n';

    export let key = 'esc';
    export let position: 'left' | 'right' = 'left';
    export let route: string;

    function goBack() {
        goto(route);
    }

    function onKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            goBack();
        }
    }
</script>

<svelte:window on:keydown={onKeydown} />

<button class="back-button {position}" on:click={goBack}>
    <div class="icon">
        {key}
    </div>
    <div class="text">{$t('back')}</div>
</button>

<style lang="scss">
    .back-button {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
        cursor: pointer;
        user-select: none;
        position: fixed;
        bottom: 100px;
        opacity: 0.6;
        transition: .3s opacity;

        &:hover {
            opacity: 1;
        }

        &.left {
            left: 100px;
        }

        &.right {
            right: 100px;
        }

        .icon {
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 100%;
            height: 20px;
            width: 20px;
            font-size: 8px;
            font-weight: 600;
            text-transform: uppercase;
            color: black;
            background: white;
            mix-blend-mode: screen;
            position: relative;
            margin-right: 12px;

            &::after {
                content: '';
                border: 1px solid white;
                position: absolute;
                top: 0;
                left: 0;
                height: 24px;
                width: 24px;
                border-radius: 50%;
                transform: translate(-2px, -2px);
                box-sizing: border-box;
            }
        }

        .text {
            letter-spacing: 2px;
            font-size: 14px;
            font-weight: 300;
            text-transform: uppercase;
        }
    }
</style>