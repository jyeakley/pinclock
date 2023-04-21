<script>
    import { onMount } from 'svelte';
    import { fetchVideos } from '../services/videoService.js';
    import { videoFiles, showBlackBackground } from '../videoStore.js';
    import Clock from "../components/Clock.svelte";
    import VideoPlayer from "../components/VideoPlayer.svelte";
    import SettingsDialog from "../components/SettingsDialog.svelte"
    import { clockFont, clockFormat } from './../store.js';
    import { clockPositionX, clockPositionY } from './../store.js';
    import { writable } from "svelte/store";
    import { onDestroy } from 'svelte';

    const randomizeVideos = writable(false);

    let time = new Date();
    let videoIndex = 0;
    let showDialog = false;
    let clockColor = 'white';
    let clockFontSize = '48px';
    let clockFormatLabel = 'HH:mm:ss'
    let showClock = true;
    let videos;

    // Subscribe to the videoFiles store
    const unsubscribe = videoFiles.subscribe((value) => {
        videos = value;
    });

    // Unsubscribe from the store when the component is destroyed
    onDestroy(unsubscribe);

    const fontOptions = [
        { label: "Arcade", value: "Arcade" },
        { label: "Arcade Alternate", value: "Arcade Alternate" },
        { label: "Arcade Book", value: "Arcade Book" },
        { label: "Arcade Classic", value: "Arcade Classic" },
        { label: "Arcade Future", value: "Arcade Future" },
        { label: "Aracde v0.1", value: "Aracde v0.1" },
        { label: "Arcade Nightmare", value: "Arcade Nightmare" },
        { label: "ARCADE I", value: "ARCADE I" },
        { label: "ARCADE N", value: "ARCADE N" },
        { label: "ARCADE R", value: "ARCADE R" },
        { label: "Arcade Pix", value: "Arcade Pix" },
        { label: "Arcadepix Plus", value: "Arcadepix Plus" },
        { label: "Arcades", value: "Arcades" },
        { label: "Arial", value: "Arial" },
        { label: "Barcade", value: "Barcade" },
        { label: "Black Arcade", value: "Black Arcade" },
        { label: "Courier New", value: "Courier New" },
        { label: "Digital Arcade", value: "Digital Arcade" },
        { label: "Helvetica", value: "Helvetica" },
        { label: "Karmatic Arcade", value: "Karmatic Arcade" },
        { label: "New Arcade", value: "New Arcade" },
        { label: "Our Arcade Games", value: "Our Arcade Games" },
        { label: "PinBall", value: "PinBall" },
        { label: "Sega Arcade", value: "Sega Arcade" },
        { label: "Times New Roman", value: "Times New Roman" },
        { label: "Verdana", value: "Verdana" }
    ];

    function updateClockFontSize(event) {
        clockFontSize = event.target.value + 'px';
        localStorage.setItem('clockFontSize', clockFontSize);
    }

    function updateClockColor(event) {
        clockColor = event.target.value;
        localStorage.setItem('clockColor', clockColor);
    }

    function updateClockPositionX(event) {
        $clockPositionX = parseInt(event.target.value);
        localStorage.setItem('clockPositionX', $clockPositionX);
    }

    function updateClockPositionY(event) {
        $clockPositionY = parseInt(event.target.value);
        localStorage.setItem('clockPositionY', $clockPositionY);
    }

    function updateClockVisibility(event) {
        showClock = event.target.checked;
        localStorage.setItem("showClock", showClock);
    }

    function updateTime() {
        time = new Date();
    }

    setInterval(updateTime, 1000);

    function toggleDialog() {
        showDialog = !showDialog;
    }

    onMount(async () => {
        await fetchVideos();

        // Load saved settings from localStorage
        const savedClockFont = localStorage.getItem('clockFont');
        const savedClockFormat = localStorage.getItem('clockFormat');
        const savedClockColor = localStorage.getItem('clockColor');
        const savedClockFontSize = localStorage.getItem('clockFontSize');
        const savedClockPositionX = localStorage.getItem('clockPositionX');
        const savedClockPositionY = localStorage.getItem('clockPositionY');
        const savedShowClock = localStorage.getItem("showClock");
        const savedRandomizeVideos = localStorage.getItem("randomizeVideos");


        if (savedClockFont) {
            $clockFont = savedClockFont;
        }
        if (savedClockFormat) {
            $clockFormat = JSON.parse(savedClockFormat).value;
            clockFormatLabel = JSON.parse(savedClockFormat).label
        }
        if (savedClockColor) {
            clockColor = savedClockColor;
        }
        if (savedClockFontSize) {
            clockFontSize = savedClockFontSize;
        }
        if (savedClockPositionX) {
            $clockPositionX = parseInt(savedClockPositionX);
        }
        if (savedClockPositionY) {
            $clockPositionY = parseInt(savedClockPositionY);
        }
        if (savedShowClock) {
            showClock = savedShowClock === "true";
        }
        if (savedRandomizeVideos !== null) {
            $randomizeVideos = savedRandomizeVideos === "true";
        }
    });

    function updateRandomizeVideos(event) {
        $randomizeVideos = event.target.checked;
        localStorage.setItem("randomizeVideos", $randomizeVideos);
    }

    // Update and save settings to localStorage
    function updateClockFont(event) {
        $clockFont = event.target.value;
        localStorage.setItem('clockFont', $clockFont);
    }

    const formatOptions = [
        { label: 'HH:mm:ss', value: { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false } },
        { label: 'HH:mm', value: { hour: '2-digit', minute: '2-digit', hour12: false } },
        { label: 'h:mm:ss a', value: { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true } },
        { label: 'h:mm a', value: { hour: 'numeric', minute: '2-digit', hour12: true } },
    ];

    function updateClockFormat(event) {
        const selectedFormat = JSON.parse(event.target.value);
        $clockFormat = selectedFormat;
        localStorage.setItem('clockFormat', JSON.stringify(selectedFormat));
        $clockFormat = selectedFormat.value;
        clockFormatLabel = selectedFormat.label
    }
</script>

<style>
    @font-face {
        font-family: "Arcade";
        src: url("/fonts/arcade/ARCADE.TTF") format("truetype");
    }
    @font-face {
        font-family: "Arcade Alternate";
        src: url("/fonts/arcade-alternate/ArcadeAlternate.ttf") format("truetype");
    }
    @font-face {
        font-family: "Arcade Book";
        src: url("/fonts/arcade-book/Arcade Book.ttf") format("truetype");
    }
    @font-face {
        font-family: "Arcade Classic";
        src: url("/fonts/arcade-classic/Arcade Classic.ttf") format("truetype");
    }
    @font-face {
        font-family: "Arcade Future";
        src: url("/fonts/arcade-future/Arcade Future.otf") format("truetype");
    }
    @font-face {
        font-family: "Aracde v0.1";
        src: url("/fonts/arcade-heliumdream/ARCADE_v0.1.ttf") format("truetype");
    }
    @font-face {
        font-family: "Arcade Nightmare";
        src: url("/fonts/arcade-nightmare/arcade_nightmare.ttf") format("truetype");
    }
    @font-face {
        font-family: "ARCADE I";
        src: url("/fonts/arcade-yuji-adachi/ARCADE_I.TTF") format("truetype");
    }
    @font-face {
        font-family: "ARCADE N";
        src: url("/fonts/arcade-yuji-adachi/ARCADE_N.TTF") format("truetype");
    }
    @font-face {
        font-family: "ARCADE R";
        src: url("/fonts/arcade-yuji-adachi/ARCADE_R.TTF") format("truetype");
    }
    @font-face {
        font-family: "Arcade Pix";
        src: url("/fonts/arcadepix/ARCADEPI.TTF") format("truetype");
    }
    @font-face {
        font-family: "Arcadepix Plus";
        src: url("/fonts/arcadepix-plus/Arcadepix Plus.ttf") format("truetype");
    }
    @font-face {
        font-family: "Arcades";
        src: url("/fonts/arcades/Arcades.ttf") format("truetype");
    }
    @font-face {
        font-family: "Barcade";
        src: url("/fonts/barcade/barcade.ttf") format("truetype");
    }
    @font-face {
        font-family: "Black Arcade";
        src: url("/fonts/black-arcade/Black Arcade Free.otf") format("truetype");
    }
    @font-face {
        font-family: "Digital Arcade";
        src: url("/fonts/digital-arcade/DigitalArcade.ttf") format("truetype");
    }
    @font-face {
        font-family: "Karmatic Arcade";
        src: url("/fonts/karmatic-arcade/ka1.ttf") format("truetype");
    }
    @font-face {
        font-family: "New Arcade";
        src: url("/fonts/new-arcades/NewArcades.ttf") format("truetype");
    }
    @font-face {
        font-family: "Our Arcade Games";
        src: url("/fonts/our-arcade-games/Our-Arcade-Games.ttf") format("truetype");
    }
    @font-face {
        font-family: "PinBall";
        src: url("/fonts/pinball/OPTIPinBall.otf") format("truetype");
    }
    @font-face {
        font-family: "Sega Arcade";
        src: url("/fonts/sega-arcade/SegaArcadeFont-Regular.ttf") format("truetype");
    }

</style>

<VideoPlayer {videoIndex} {randomizeVideos} />


{#if showClock || $showBlackBackground}
    <Clock
            {time}
            {clockFont}
            {clockColor}
            {clockFontSize}
            {clockPositionX}
            {clockPositionY}
            {clockFormat}
    />
{/if}

<SettingsDialog
        {showDialog}
        {updateClockFont}
        {fontOptions}
        {clockFont}
        {updateClockFormat}
        {formatOptions}
        {clockColor}
        {updateClockColor}
        {clockFontSize}
        {clockPositionY}
        {clockPositionX}
        {updateClockVisibility}
        {updateClockPositionY}
        {clockFormatLabel}
        {updateClockPositionX}
        {randomizeVideos}
        {showClock}
        {updateRandomizeVideos}
        {updateClockFontSize}
/>

<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" on:click={toggleDialog} on:keydown={toggleDialog}></div>
