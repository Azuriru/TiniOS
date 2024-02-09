<div class="desktop">
    <div class="windows" />
</div>

<style lang="scss">
    .desktop {
        display: flex;
        /* align-items: center;
        justify-content: center; */
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        z-index: 0; /* This is to solve the taskbar problem */
    }

    .desktop .windows {
        display: flex;
        width: 100%;
        transition: .3s opacity;
    }

    .window {
        display: flex;
        flex-direction: column;
        position: absolute;
        /* transition: .3s; */
        background-color: rgb(255, 255, 255, .1);
        border: 1px solid var(--windows);
        top: 0;
        opacity: 1;
    }

    .window.appearing {
        margin-top: 20px;
        opacity: 0;
    }

    .window.minimized {
        margin-top: 20px;
        opacity: 0;
        pointer-events: none;
    }

    /* yes, this kills me. */
    .window.maximized {
        width: 100% !important;
        height: 100% !important;
        top: 0 !important;
        left: 0 !important;
        transform: none !important;
    }

    .window.maximized .resize-handles {
        display: none;
    }

    .window .titlebar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: var(--windows);
        transition: .3s background-color, .3s border-color;
    }

    .window .titlebar:not(.custom) {
        background-color: #2b2b2b;
        height: 24px;
    }

    .window .titlebar:not(.custom) .title {
        color: rgb(255, 255, 255, .3);
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-left: 6px;
    }

    .window .titlebar .window-buttons {
        display: flex;
    }

    .window .titlebar .window-buttons .window-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 28px;
        height: 24px;
        transition: .3s background-color;
    }

    .window .titlebar .window-buttons .window-button:hover {
        background-color: rgb(255, 255, 255, .1);
    }

    .window .titlebar .window-buttons .window-button.minimize .icon {
        border-bottom: 1px solid white;
        width: 14px;
        height: 2px;
        transform: translate(0, 6px);
    }

    .window.maximized .titlebar .window-buttons .window-button.maximize .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 14px;
        width: 14px;
        border: none;
    }

    .window.maximized .titlebar .window-buttons .window-button.maximize .icon::before,
    .window.maximized .titlebar .window-buttons .window-button.maximize .icon::after {
        content: '';
        border: 1px solid white;
        width: 10px;
        height: 10px;
    }

    .window.maximized .titlebar .window-buttons .window-button.maximize .icon::before {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 60% 100%, 60% 40%, 0 40%);
        transform: translate(2px, -2px);
    }

    .window.maximized .titlebar .window-buttons .window-button.maximize .icon::after {
        position: absolute;
        transform: translate(-2px, 2px);
    }

    .window .titlebar .window-buttons .window-button.maximize .icon {
        width: 14px;
        height: 14px;
        border: 1px solid white;
    }

    .window .titlebar .window-buttons .window-button.close:hover {
        background-color: #cd0b1c;
    }

    .window .titlebar .window-buttons .window-button.close .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .window .titlebar .window-buttons .window-button.close .icon::before,
    .window .titlebar .window-buttons .window-button.close .icon::after {
        content: '';
        border-bottom: 1px solid white;
        background: transparent;
        width: 18px;
        height: 1px;
        position: absolute;
    }

    .window .titlebar .window-buttons .window-button.close .icon::before {
        transform: rotate(-45deg);
    }

    .window .titlebar .window-buttons .window-button.close .icon::after {
        transform: rotate(45deg);
    }

    .window .app {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-color: transparent;
        border: 1px solid var(--windows);
        border-top: none;
        transition: border-color .3s;
        overflow: auto; /* Temp */
    }

    .window .resize-handles .handle {
        position: absolute;
        background-color: transparent;
    }

    .window .resize-handles .n,
    .window .resize-handles .s {
        height: 5px;
        left: 10px;
        right: 10px;
        cursor: ns-resize;
    }

    .window .resize-handles .n {
        top: 0;
    }

    .window .resize-handles .s {
        bottom: 0;
    }

    .window .resize-handles .e,
    .window .resize-handles .w {
        width: 5px;
        top: 10px;
        bottom: 10px;
        cursor: ew-resize;
    }

    .window .resize-handles .e {
        right: 0;
    }

    .window .resize-handles .w {
        left: 0;
    }

    .window .resize-handles .ne,
    .window .resize-handles .se,
    .window .resize-handles .sw,
    .window .resize-handles .nw {
        height: 10px;
        width: 10px;
    }

    .window .resize-handles .ne,
    .window .resize-handles .sw {
        cursor: nesw-resize;
    }

    .window .resize-handles .nw,
    .window .resize-handles .se {
        cursor: nwse-resize;
    }

    .window .resize-handles .ne,
    .window .resize-handles .se {
        right: 0;
    }

    .window .resize-handles .sw,
    .window .resize-handles .nw {
        left: 0;
    }

    .window .resize-handles .ne,
    .window .resize-handles .nw  {
        top: 0;
    }

    .window .resize-handles .se,
    .window .resize-handles .sw {
        bottom: 0;
    }
</style>