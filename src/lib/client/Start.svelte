<script lang="ts">
    let isOpen = $state(false);

    function onClick() {
        isOpen = !isOpen;
    }
</script>

<div class="start">
    <button type="button" class="start-icon" on:click={onClick}>
        <div class="buntini-icon" />
    </button>
    <div class="start-content" class:hidden={!isOpen}>
        <!-- <Sidebar /> -->
        <!-- <Main /> -->
    </div>
    <div class="context" />
</div>

<style lang="scss">
    .start {
        @include flex;
        background-color: var(--taskbar);
        width: 58px;
        height: 44px;

        .start-icon {
            @include flex(center, one);
            backdrop-filter: blur(5px);
            transition: 0.3s background-color;

            &:hover {
                background-color: hsla(
                    var(--color-hue, 180),
                    var(--color-sat, 100%),
                    var(--color-lig, 50%),
                    0.1
                );

                .buntini-icon {
                    opacity: 0.9;
                }
            }

            &.active {
                background-color: var(--start);
            }

            .buntini-icon {
                width: 32px;
                height: 32px;
                mask-size: 32px;
                opacity: 0.7;
                transition: 0.3s opacity;
            }
        }

        .start-content {
            @include flex;
            background-color: var(--start);
            font-size: 16px;
            width: 300px;
            height: 600px;
            position: absolute;
            bottom: 44px;
            left: 0;
            backdrop-filter: blur(5px);

            &.hidden {
                display: none;
            }
        }
    }
</style>
