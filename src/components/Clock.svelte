<script>
    import {overriddenClockTime} from '../store.js';
    import {onMount, onDestroy} from "svelte";

    export let clockFont;
    export let clockColor;
    export let clockFontSize;
    export let clockPositionX;
    export let clockPositionY;
    export let clockFormat;
    let interval;
    let time;

    onMount(() => {
        interval = setInterval(tick, 1000);
        const savedOverriddenClockTime = localStorage.getItem("overriddenClockTime");
        if (savedOverriddenClockTime !== null && savedOverriddenClockTime !== 'null') {
            $overriddenClockTime = new Date(savedOverriddenClockTime);
        }
    });

    const unsubscribe = overriddenClockTime.subscribe((value) => {
        time = value || new Date();
    });

    onDestroy(() => {
        clearInterval(interval);
    });
    onDestroy(unsubscribe);

    function tick() {
        if (!$overriddenClockTime) {
            time = new Date();
        } else {
            time = new Date(time.getTime() + 1000);
        }
    }
</script>

<style>
    .clock {
        font-size: 48px;
        text-align: center;
        z-index: 1;
        position: relative;
    }
</style>

<div class="clock" style="font-family: {$clockFont}; color: {clockColor}; font-size: {clockFontSize}; margin-top: {$clockPositionY}px; margin-left: {$clockPositionX}px;">
    {time.toLocaleTimeString('en-US', $clockFormat)}
</div>
