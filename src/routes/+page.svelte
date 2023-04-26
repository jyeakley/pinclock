<script>
    import { onMount } from 'svelte';
    import { fetchVideos } from '../services/videoService.js';
    import { videoFiles, showBlackBackground } from '../videoStore.js';
    import Clock from "../components/Clock.svelte";
    import VideoPlayer from "../components/VideoPlayer.svelte";
    import SettingsDialog from "../components/SettingsDialog.svelte"
    import { clockPositionX, clockPositionY, clockFont, clockFormat } from './../store.js';
    import { writable } from "svelte/store";
    import { onDestroy } from 'svelte';

    const randomizeVideos = writable(false);

    let videoIndex = 0;
    let showDialog = false;
    let clockColor = 'white';
    let clockFontSize = '48px';
    let clockFormatLabel = 'h:mm:ss a'
    let showClock = true;
    let videos;

    // Subscribe to the videoFiles store
    const unsubscribe = videoFiles.subscribe((value) => {
        videos = value;
    });

    // Unsubscribe from the store when the component is destroyed
    onDestroy(unsubscribe);

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

    function toggleDialog() {
        showDialog = !showDialog;
    }

    onMount(async () => {
        // Load saved settings from localStorage
        const savedClockFont = localStorage.getItem('clockFont');
        const savedClockFormat = localStorage.getItem('clockFormat');
        const savedClockColor = localStorage.getItem('clockColor');
        const savedClockFontSize = localStorage.getItem('clockFontSize');
        const savedClockPositionX = localStorage.getItem('clockPositionX');
        const savedClockPositionY = localStorage.getItem('clockPositionY');
        const savedShowClock = localStorage.getItem("showClock");
        const savedRandomizeVideos = localStorage.getItem("randomizeVideos");
        const savedSelectedFolders = localStorage.getItem("selectedFolders");

        if (savedClockFont) {
            $clockFont = savedClockFont;
        }
        if (savedClockFormat) {
            $clockFormat = JSON.parse(savedClockFormat).value;
            clockFormatLabel = JSON.parse(savedClockFormat).label
        }else{
            clockFormatLabel = 'h:mm:ss a'
        }
        if (savedClockColor) {
            clockColor = savedClockColor;
        }else{
            clockColor = '#ffffff'
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
        await fetchVideos(savedSelectedFolders ? savedSelectedFolders : []);
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

    function updateClockFormat(event) {
        const selectedFormat = JSON.parse(event.target.value);
        $clockFormat = selectedFormat;
        localStorage.setItem('clockFormat', JSON.stringify(selectedFormat));
        $clockFormat = selectedFormat.value;
        clockFormatLabel = selectedFormat.label
    }
</script>

<VideoPlayer {videoIndex} {randomizeVideos} />


{#if showClock || $showBlackBackground}
    <Clock
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
        {clockFont}
        {updateClockFormat}
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
