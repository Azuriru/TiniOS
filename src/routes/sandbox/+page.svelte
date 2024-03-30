<script lang="ts">
    import { store } from '$lib/redux';
    import { increment } from '$lib/redux/counter';

    $: count = $store.counter;
</script>

{#snippet a()}
    <div class="asd">asd</div>
{/snippet}

<div class="parent">
    {@render a()}
</div>

{count}

<button type="button" on:click={() => store.dispatch(increment())}>plus</button>

<div class="settings">
    <div class="text" />
    <div class="twinkle base rotated">
        <div class="trail" />
    </div>
    <div class="twinkle base">
        <div class="shine" />
        <div class="twinkle rotated base" />
    </div>
    <div class="glimmer base">
        <div class="shimmer" />
        <div class="shimmer" />
        <div class="twinkle base rotated" />
    </div>
    <div class="s3" />
</div>

<style lang="scss">
    .parent {
        isolation: isolate;
    }

    :global(.parent .asd) {
        color: blue;
    }

    :global(.parent) {
        .asd {
            color: white;
        }
    }

    .asd {
        color: red;
    }

    .base {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .twinkle {
        &::before,
        &::after {
            content: "";
            display: block;
            width: 40px;
            height: 2px;
            background: linear-gradient(
                to right,
                transparent,
                #5f91ff,
                transparent
            );
            border-radius: 100%;
            position: absolute;
        }

        &::after {
            transform: rotate(90deg);
        }

        &.rotated::before {
            transform: rotate(45deg);
        }

        &.rotated::after {
            transform: rotate(-45deg);
        }
    }

    .glimmer {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        box-shadow:
            0 0 2px 0px #5f91ff,
            inset 0 0 2px 0px #5f91ff;

        &::before,
        &::after {
            content: "";
            display: block;
            width: 100px;
            height: 1px;
            background: linear-gradient(
                to right,
                transparent,
                #5f91ff,
                transparent
            );
            position: absolute;
        }

        &::after {
            transform: rotate(90deg);
        }

        .shimmer {
            position: absolute;
        }

        .shimmer:nth-of-type(1) {
            width: 4px;
            height: 4px;
            background: #ffffff;
            box-shadow:
                0 0 1px 1px #ffffff,
                0 0 10px 4px #dee8ff;
            border-radius: 100%;
            z-index: 1;
        }

        .shimmer:nth-of-type(2) {
            width: 15px;
            height: 15px;
            box-shadow:
                0 0 2px 0px #5f91ff,
                0 0 20px 0px #5f91ff,
                inset 0 0 5px 0px #5f91ff,
                0 0 20px 2px #5f91ff;
            border-radius: 100%;
            z-index: 1;
        }
    }

    .shine {
        box-shadow:
            0 0 4px 4px #5f91ff,
            0 0 20px 4px #ffffff,
            0 0 20px 6px #83a9ff;

        + .rotated {
            &::before,
            &::after {
                width: 25px;
                height: 2px;
            }
        }
    }

    .trail {
        width: 50px;
        height: 2px;
        background: linear-gradient(to right, transparent, white);
        position: absolute;
        right: 0;
    }

    .settings {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 100%;
    }

    .text {
        font-size: 40px;
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 8px;
        background: -webkit-linear-gradient(white, #38495a);
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
</style>