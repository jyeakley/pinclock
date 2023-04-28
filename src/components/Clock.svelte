<script>
    import {overriddenClockTime, clockTextShadow, clockSeparatorBlinkSpeed} from '../store.js';
    import {onMount, onDestroy} from "svelte";

    export let clockFont;
    export let clockColor;
    export let clockFontSize;
    export let clockPositionX;
    export let clockPositionY;
    export let clockFormat;
    export let enableScreensaver = false;
    let movementState;
    let interval;
    let moveInterval;
    let time;
    let parts = [];
    let cleanupUnsubscribe;
    let screensaverClockPositionY;
    let screensaverClockPositionX;

    $: {
        if (time) {
            parts = time.toLocaleTimeString('en-US', $clockFormat).split(':');
        }
    }

    function updateClockPosition() {
        const clockElement = document.querySelector('.clock');
        const clockRect = clockElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;

        let newMarginTop = parseFloat(clockElement.style.marginTop) + movementState.y;
        let newMarginLeft = parseFloat(clockElement.style.marginLeft) + movementState.x;

        // Check if the clock is about to go beyond the top or bottom of the screen
        if (newMarginTop < 0 || newMarginTop + clockRect.height > windowHeight) {
            movementState.y = -movementState.y;
        }

        // Check if the clock is about to go beyond the left or right of the screen
        if (newMarginLeft < 0 || newMarginLeft + clockRect.width > windowWidth) {
            movementState.x = -movementState.x;
        }

        newMarginTop = Math.min(Math.max(newMarginTop, 0), windowHeight - clockRect.height);
        newMarginLeft = Math.min(Math.max(newMarginLeft, 0), windowWidth - clockRect.width);

        clockElement.style.marginTop = `${newMarginTop}px`;
        clockElement.style.marginLeft = `${newMarginLeft}px`;

        // Request another animation frame
        requestAnimationFrame(updateClockPosition);
    }

    function updateMovementState() {
        movementState = {
            x: (Math.random() * 2 - 1) * 1,
            y: (Math.random() * 2 - 1) * 1,
        };
    }

    onMount(() => {
        interval = setInterval(tick, 1000);
        const savedOverriddenClockTime = localStorage.getItem("overriddenClockTime");
        const savedClockTextShadow = localStorage.getItem("clockTextShadow");
        if (typeof window !== 'undefined') {
            const savedScreensaverClockPositionY = localStorage.getItem("screensaverClockPositionY");
            const savedScreensaverClockPositionX = localStorage.getItem("screensaverClockPositionX");

            if (savedScreensaverClockPositionY !== null) {
                screensaverClockPositionY = parseFloat(savedScreensaverClockPositionY);
            }
            if (savedScreensaverClockPositionX !== null) {
                screensaverClockPositionX = parseFloat(savedScreensaverClockPositionX);
            }
        }
        if (savedOverriddenClockTime !== null && savedOverriddenClockTime !== 'null') {
            $overriddenClockTime = new Date(savedOverriddenClockTime);
        }
        if (savedClockTextShadow) {
            $clockTextShadow = parseInt(savedClockTextShadow);
        }
        if (enableScreensaver) {
            movementState = { x: 1, y: 1 };
            interval = setInterval(tick, 1000);
            requestAnimationFrame(updateClockPosition);
        } else {
            interval = setInterval(tick, 1000);
        }

        cleanupUnsubscribe = overriddenClockTime.subscribe((value) => {
            time = value || new Date();
        });
    });

    onDestroy(() => {
        if (typeof window !== 'undefined') {
            // Save the clock's position to local storage
            const clockElement = document.querySelector(".clock");
            localStorage.setItem("screensaverClockPositionY", clockElement.style.marginTop);
            localStorage.setItem("screensaverClockPositionX", clockElement.style.marginLeft);
        }
        if (typeof cleanupUnsubscribe === 'function') {
            cleanupUnsubscribe();
        }
        clearInterval(interval);
        if(moveInterval){
            clearInterval(moveInterval); // Use moveInterval instead of interval
        }
    });

    const unsubscribe = overriddenClockTime.subscribe((value) => {
        time = value || new Date();
    });

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
        position: absolute; /* or 'fixed' */
        top: 0;
        left: 0;
        white-space: nowrap;
    }
    .clock span {
        display: inline-block;
        margin: 0;
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

<div class="clock" style="font-family: {$clockFont}; color: {clockColor}; font-size: {clockFontSize}; margin-top: {enableScreensaver ? screensaverClockPositionY : $clockPositionY}px; margin-left: {enableScreensaver ? screensaverClockPositionX : $clockPositionX}px; text-shadow: 0 {$clockTextShadow}px {$clockTextShadow}px rgba(0, 0, 0, 0.5);">
    {#each parts as part, index}
        <span class="time-part">{part}</span><!--
        -->{#if index < parts.length - 1}
        <span class="blink" style="animation-duration: {$clockSeparatorBlinkSpeed}s;">:</span>
    {/if}
    {/each}
</div>


