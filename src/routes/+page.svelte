<script>
    import { onMount } from 'svelte';
    import Weather from '../components/Weather.svelte';
    import { fetchVideos } from '../services/videoService.js';
    import {fetchWeatherData} from '../services/weatherService.js'
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
    let enableScreensaver = false;
    let screensaverSpeed = 1;
    let weatherData = "";
    let weatherAPIKey = "";
    let weatherZipCode = "";
    let alwaysShowWeather = false;

    $: {
        if(weatherAPIKey || weatherZipCode){
            handleRefresh();
        }
    }

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
        const savedScreensaverMode = localStorage.getItem("screensaverMode");
        const savedScreensaverSpeed = localStorage.getItem("screensaverSpeed");
        const savedWeatherAPIKey = localStorage.getItem("weatherAPIKey");
        const savedWeatherZipCode = localStorage.getItem("weatherZipCode");
        const savedWeatherAlwaysShow = localStorage.getItem("alwaysShowWeather");

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
        if (savedScreensaverMode) {
            enableScreensaver = savedScreensaverMode === "true";
        }
        if (savedScreensaverSpeed !== null) {
            screensaverSpeed = parseFloat(savedScreensaverSpeed);
        }
        if (savedWeatherAPIKey !== null) {
            weatherAPIKey = savedWeatherAPIKey;
        }
        if (savedWeatherZipCode !== null) {
            weatherZipCode = savedWeatherZipCode;
        }
        if (savedWeatherAlwaysShow !== null) {
            alwaysShowWeather = savedWeatherAlwaysShow === "true";;
        }
        if(weatherAPIKey.length > 0){
            handleRefresh();
            setInterval(handleRefresh, 5 * 60 * 1000);
        }
        console.log("SAVED HP: " + savedSelectedFolders);
        await fetchVideos(savedSelectedFolders ? savedSelectedFolders : []);
    });

    function updateWeatherAPIKey(event) {
        weatherAPIKey = event.target.value;
        localStorage.setItem("weatherAPIKey", weatherAPIKey);
    }

    function updateWeatherZipCode(event) {
        weatherZipCode = event.target.value;
        localStorage.setItem("weatherZipCode", weatherZipCode);
    }

    function updateWeatherAlwaysShow(event) {
        alwaysShowWeather = event.target.checked;
        localStorage.setItem("alwaysShowWeather", alwaysShowWeather);
    }

    function updateScreensaverMode(event) {
        enableScreensaver = event.target.checked;
        localStorage.setItem("screensaverMode", enableScreensaver);
    }

    function updateScreensaverSpeed(event) {
        screensaverSpeed = parseFloat(event.target.value);
        localStorage.setItem('screensaverSpeed', screensaverSpeed);
    }

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

    async function handleRefresh() {
        weatherData = await fetchWeatherData(weatherAPIKey, weatherZipCode);
    }
</script>

{#if weatherData && weatherAPIKey.length >0 && (alwaysShowWeather || $showBlackBackground)}
    <Weather {weatherData} />
{/if}

<VideoPlayer {videoIndex} {randomizeVideos} />



{#if showClock || $showBlackBackground}
    <Clock
            {clockFont}
            {clockColor}
            {clockFontSize}
            {clockPositionX}
            {clockPositionY}
            {clockFormat}
            {enableScreensaver}
            {screensaverSpeed}
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
        {enableScreensaver}
        {updateScreensaverMode}
        {screensaverSpeed}
        {updateScreensaverSpeed}
        {weatherAPIKey}
        {weatherZipCode}
        {alwaysShowWeather}
        {updateWeatherAPIKey}
        {updateWeatherZipCode}
        {updateWeatherAlwaysShow}
/>

<div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;" on:click={toggleDialog} on:keydown={toggleDialog}></div>
