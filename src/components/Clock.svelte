<script>
    export let time;
    export let clockFont;
    export let clockColor;
    export let clockFontSize;
    export let clockPositionX;
    export let clockPositionY;
    export let clockFormat;
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