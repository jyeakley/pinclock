<script>
    import {overriddenClockTime, clockTextShadow, clockSeparatorBlinkSpeed} from '../store.js';
    import {onMount, onDestroy} from "svelte";

    export let clockFont;
    export let clockColor;
    export let clockFontSize;
    export let clockPositionX;
    export let clockPositionY;
    export let clockFormat;
    let interval;
    let time;
    let parts = [];

    $: {
        if (time) {
            parts = time.toLocaleTimeString('en-US', $clockFormat).split(':');
        }
    }

    onMount(() => {
        interval = setInterval(tick, 1000);
        const savedOverriddenClockTime = localStorage.getItem("overriddenClockTime");
        const savedClockTextShadow = localStorage.getItem("clockTextShadow");

        if (savedOverriddenClockTime !== null && savedOverriddenClockTime !== 'null') {
            $overriddenClockTime = new Date(savedOverriddenClockTime);
        }
        if (savedClockTextShadow) {
            $clockTextShadow = parseInt(savedClockTextShadow);
        }
    });

    const unsubscribe = overriddenClockTime.subscribe((value) => {
        time = value || new Date();
    });

    onDestroy(() => {
        clearInterval(interval);
    });
    onDestroy(unsubscribe);

    if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
            const savedOverriddenClockTime = localStorage.getItem("overriddenClockTime");
            if (savedOverriddenClockTime !== null && savedOverriddenClockTime !== 'null') {
                localStorage.setItem('overriddenClockTime', time ? time.toISOString() : null);
            }
        });
    }
    function tick() {
        if (!$overriddenClockTime) {
            time = new Date();
        } else {
            time = new Date(time.getTime() + 1000);
        }
    }
</script>

<style>
    @import "./font-faces.css";
    .clock {
        font-size: 48px;
        text-align: center;
        z-index: 1;
        position: relative;
    }
    .blink {
        animation-name: blink;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
    }

    @keyframes blink {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
</style>

<div class="clock" style="font-family: {$clockFont}; color: {clockColor}; font-size: {clockFontSize}; margin-top: {$clockPositionY}px; margin-left: {$clockPositionX}px; text-shadow: 0 {$clockTextShadow}px {$clockTextShadow}px rgba(0, 0, 0, 0.5);">
    {#each parts as part, index}
        {part}
        {#if index < 2}
            <span class="blink" style="animation-duration: {$clockSeparatorBlinkSpeed}s;">:</span>
        {/if}
    {/each}
</div>
