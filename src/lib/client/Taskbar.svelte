<script lang="ts">
    import { Icon } from '$lib/components';
    import Start from './Start.svelte';
</script>

<div class="taskbar">
    <Start />
    <div class="container">
        <div class="left">
            <div class="search">
                <Icon name="search" />
            </div>
            <div class="app-tray">
                <!-- {apps.map(app => <App key={app} name={app} />)} -->
            </div>
        </div>
        <div class="right">
            <div class="secondary-controls" />
            <div class="lang-switch" />
            <!-- <Clock /> -->
            <div class="show-desktop" />
        </div>
    </div>
    <div class="context" />
    <div class="previews">
        <div class="previews-control previews-up disabled" />
        <div class="previews-list" />
        <div class="previews-control previews-down" />
    </div>
    <div class="preview" />
</div>

<style lang="scss">
    .taskbar {
        @include flex;
        height: 44px;
        font-size: 12px;

        .container {
            @include flex(centerY, between, one);
            background-color: var(--taskbar);
            backdrop-filter: blur(5px);
        }

        .left,
        .right {
            @include flex;
            height: 100%;
        }

        .search {
            @include flex(center);
            width: 58px;
            background-color: transparent;
            margin-right: 1px;
            transition: 0.3s background-color;

            &:hover {
                background-color: hsla(
                    var(--color-hue, 180),
                    var(--color-sat, 100%),
                    var(--color-lig, 50%),
                    0.1
                );
            }
        }

        .app-tray {
            @include flex;

            .app {
                @include flex(centerX);
                width: 58px;
                margin-right: 1px;
                transition:
                    0.3s margin-left,
                    0.3s opacity;

                &.hover .panels:empty,
                &.hover .panels .panel {
                    background-color: hsla(
                        var(--color-hue, 180),
                        var(--color-sat, 100%),
                        var(--color-lig, 50%),
                        0.1
                    );
                }

                &:active .panels:empty,
                &:active .panels .panel {
                    background-color: hsla(
                        var(--color-hue, 180),
                        var(--color-sat, 100%),
                        var(--color-lig, 50%),
                        0.12
                    );
                }

                &.active .panels .panel {
                    background-color: hsla(
                        var(--color-hue, 180),
                        var(--color-sat, 100%),
                        var(--color-lig, 50%),
                        0.15
                    );
                }

                &.active:hover .panels .panel {
                    background-color: hsla(
                        var(--color-hue, 180),
                        var(--color-sat, 100%),
                        var(--color-lig, 50%),
                        0.2
                    );
                }

                &.active:active .panels .panel {
                    background-color: hsla(
                        var(--color-hue, 180),
                        var(--color-sat, 100%),
                        var(--color-lig, 50%),
                        0.25
                    );
                }

                &:hover .panels .panel:first-of-type:only-child,
                &.active .panels .panel:first-of-type:only-child {
                    width: 58px;
                }

                &.app:hover .panels .panel:first-of-type:nth-last-of-type(2),
                &.app.active .panels .panel:first-of-type:nth-last-of-type(2) {
                    width: 54px;
                }

                &.app:hover .panels .panel:first-of-type,
                &.app.active .panels .panel:first-of-type {
                    width: 50px;
                }

                &.app:hover .panels .panel:nth-of-type(2),
                &.app.active .panels .panel:nth-of-type(2),
                &.app:hover .panels .panel:nth-of-type(3),
                &.app.active .panels .panel:nth-of-type(3) {
                    width: 4px;
                }

                .label {
                    @include flex(center);
                }

                .icon {
                    @include flex(center);
                    height: 100%;
                    width: 100%;
                    position: absolute;
                    user-select: none;
                    z-index: 1;

                    .tooltip {
                        transform: translate(-50%, calc(-100% - 18px));
                    }
                }

                .panels {
                    @include flex;
                    // height: 100%;
                    transition: 0.3s background-color;

                    .panel {
                        @include flex(endY);
                        // height: 100%;
                        transition: 0.3s;
                        /* animation: fadeIn .5s forwards; */

                        &.hidden {
                            filter: opacity(0);
                        }

                        /** Single panel **/
                        &:first-of-type:only-child {
                            width: 52px;
                        }

                        /** Double panel **/
                        &:first-of-type:nth-last-of-type(2) {
                            width: 42px;
                        }

                        /** Triple panel **/
                        &:first-of-type {
                            width: 32px;
                        }

                        &:nth-of-type(2),
                        &:nth-of-type(3) {
                            width: 10px;
                        }

                        &:nth-of-type(2) {
                            filter: brightness(0.7);
                        }

                        &:nth-of-type(3) {
                            filter: brightness(0.5);
                        }

                        .indicator {
                            @include flex;
                            background-color: rgb(var(--color-rgb));
                            width: 100%;
                            height: 3px;
                        }
                    }
                }
            }
        }
    }
</style>