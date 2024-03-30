<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { MouseEventHandler } from 'svelte/elements';
    import Icon from '$lib/components/Icon.svelte';

    let isOpen = $state(true);
    let isPowerOpen = $state(false);
    let isPowerAppended = $state(false);

    type SidebarIconProps = {
        icon: string;
        text: string;
        onClick?: MouseEventHandler<HTMLButtonElement>;
        onMouseLeave?: MouseEventHandler<HTMLButtonElement>;
        children?: PowerOptionProps[];
    };

    type PowerOptionProps = {
        icon: string;
        text: string;
        onClick?: MouseEventHandler<HTMLButtonElement>;
    };

    function onClick() {
        isOpen = !isOpen;
    }

    function togglePowerVisible() {
        isPowerAppended = true;
        isPowerOpen = !isPowerOpen;
    }

    function onPowerTransitionEnd() {
        isPowerAppended = isPowerOpen;
    }

    function onMouseLeave() {
        isPowerOpen = false;
    }

    function onSidebarEnter() {
        isOpen = true;
    }

    function onSidebarLeave() {
        isOpen = false;
    }
</script>

{#snippet PowerOption({ icon, text, onClick }: PowerOptionProps)}
    <button type="button" class="power-option" on:click={onClick}>
        <Icon name={icon} />
        <div>{text}</div>
    </button>
{/snippet}

{#snippet SidebarIcon({ icon, text, onClick, onMouseLeave, children }: SidebarIconProps)}
    <button type="button" class="sidebar-item" on:click={onClick} on:mouseleave={onMouseLeave}>
        <div class="icon">
            <Icon name={icon} />
        </div>
        <div class="name">{text}</div>
        {#if children}
            <div class="power-options" class:visible={isPowerOpen} class:appended={isPowerAppended} on:transitionend={onPowerTransitionEnd}>
                {#each children as child (child)}
                    {@render PowerOption(child)}
                {/each}
            </div>
        {/if}
    </button>
{/snippet}

<div class="start">
    <button type="button" class="start-icon" on:click={onClick}>
        <div class="buntini-icon" />
    </button>
    <div class="start-content" class:hidden={!isOpen}>
        <div class="sidebar">
            <div class="sidebar-content" class:active={isOpen}>
                {@render SidebarIcon({
                    icon: 'bars',
                    text: 'Menu'
                })}
                {@render SidebarIcon({
                    icon: 'circle-user',
                    text: 'Account'
                })}
                {@render SidebarIcon({
                    icon: 'gear',
                    text: 'Settings'
                })}
                {@render SidebarIcon({
                    icon: 'power-off',
                    text: 'Power',
                    onClick: togglePowerVisible,
                    onMouseLeave,
                    children: [
                        {
                            icon: 'dark_mode',
                            text: 'Sleep'
                        },
                        {
                            icon: 'power_settings_new',
                            text: 'Shut Down'
                        },
                        {
                            icon: 'refresh',
                            text: 'Restart'
                        }
                    ]
                })}
            </div>
        </div>
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

            .sidebar {
                @include flex;
                position: absolute;
                top: 0;
                bottom: 0;
                z-index: 1;

                .sidebar-content {
                    @include flex(column, endX);
                    width: 58px;
                    position: relative;
                    overflow: hidden;
                    transition: 0.3s 0.3s;

                    &.active {
                        background-color: var(--start-sidebar);
                        width: 200px;
                        backdrop-filter: blur(5px);
                    }


                }
            }

            .main {
                @include flex(column, endX);
                position: absolute;
                top: 0;
                left: 58px;
                bottom: 0;
                right: 0px;

                .divider {
                    background: rgba(255, 255, 255, .1);
                    height: 1px;
                    width: 90%;
                    margin: 2px auto;
                }

                > .divider {
                    width: 96%;
                }

                .start-search {
                    @include flex(centerY);
                    background-color: hsl(var(--color-accent-hue, 0), var(--color-accent-sat, 0%), 50%, .05);
                    height: 32px;
                    margin: 8px;
                    transition: 0.3s background-color;

                    &:hover,
                    &:focus {
                        background-color: hsl(var(--color-accent-hue, 0), var(--color-accent-sat, 0%), 50%, .2);
                    }

                    .search-icon {
                        @include flex(center, noShrink);
                        width: 32px;
                        height: 32px;
                        margin-right: 4px;
                        transform: scaleX(-1) translateY(1px);
                    }

                    .search-input {
                        @include flex;
                        width: 100%;
                        font-size: 18px;
                        line-height: 24px;
                        padding-right: 6px;
                    }
                }

                .main-content {
                    @include flex(column, one);
                    overflow: hidden;
                }
            }

        }

        .context {
            @include flex(hidden, column);
            background-color: hsla(
                var(--color-hue, 180),
                var(--color-sat, 50%),
                var(--color-lig, 25%),
                0.9
            );
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            width: 210px;
            height: fit-content;
            padding: 2px 4px;
            position: fixed;
            z-index: 2;

            .context-group {
                @include flex(column);

                &:not(:last-of-type)::after {
                    content: '';
                    background-color: rgb(255, 255, 255, 0.1);
                    width: 96%;
                    height: 1px;
                    margin: 2px auto;
                }

                .context-item {
                    @include flex(centerY);
                    height: 28px;
                    padding: 0px 8px;
                    margin: 2px 0;
                    transition: 0.3s background-color;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.1);
                    }
                }
            }
        }
    }

    .sidebar-item {
        @include flex(centerY);
        width: 200px;
        font-size: 16px;
        transition: .3s;

        &:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }

        &:first-of-type {
            position: absolute;
            top: 0;
        }

        &:not(:first-of-type) .name {
            margin-left: 1px;
        }

        .icon {
            @include flex(center);
            width: 58px;
            height: 44px;
        }

        .power-options {
            @include flex(column);
            visibility: hidden;
            background-color: var(--start-context);
            border: 1px solid var(--taskbar-container);
            width: 100%;
            padding: 8px 2px;
            position: absolute;
            bottom: 44px;
            opacity: 0;
            transform: translateY(4px);
            backdrop-filter: blur(5px);
            transition: var(--transition);

            &.visible {
                opacity: 1;
                transform: translateY(0px);
            }

            &.appended {
                visibility: visible;
            }

            .power-option {
                @include flex(centerY);
                padding: 1px 8px;
                margin: 1px 0;
                font-size: 12px;
                transition: 0.3s background-color;

                &:hover {
                    background: rgb(255, 255, 255, .1);
                }

                .mi {
                    margin-right: 8px;
                }
            }
        }
    }
</style>