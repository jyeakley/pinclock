<script>
    import { videoFiles, showBlackBackground,videoFadeOutTime, timeBetweenVideos, videoPlayTime } from '../videoStore.js';
    import { onMount } from 'svelte';
    import {onDestroy} from "svelte";
    export let videoIndex;
    export let randomizeVideos;
    let videos;
    let timeoutId;

    onMount(() => {
        const savedVideoFadeOutTime = localStorage.getItem("videoFadeOutTime");
        const savedTimeBetweenVideos = localStorage.getItem("timeBetweenVideos");
        const savedVideoPlayTime = localStorage.getItem("videoPlayTime");

        if (savedVideoFadeOutTime) {
            $videoFadeOutTime = parseFloat(savedVideoFadeOutTime);
        }
        if (savedTimeBetweenVideos) {
            $timeBetweenVideos = parseFloat(savedTimeBetweenVideos);
        }
        if (savedVideoPlayTime) {
            $videoPlayTime = parseFloat(savedVideoPlayTime);
        }

        setTimeout(changeBackground);
    });

    async function changeBackground() {
        $showBlackBackground = true;
        if (videos.length === 0) {
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Select a video based on the randomizeVideos setting
        if ($randomizeVideos) {
            const randomIndex = Math.floor(Math.random() * videos.length);
            videoIndex = randomIndex;
        } else {
            videoIndex = (videoIndex + 1) % videos.length;
        }

        if (!videos[videoIndex] || videos[videoIndex] === 'undefined') {
            return;
        }

        const videoElement = document.getElementById("background-video");
        videoElement.src = `/videos/${encodeURIComponent(videos[videoIndex])}`;
        videoElement.style.transition = `opacity ${$videoFadeOutTime}s`;
        videoElement.style.opacity = 0;
        videoElement.addEventListener('loadedmetadata', () => {
            videoElement.currentTime = 0;
        });
        await new Promise((resolve) => setTimeout(resolve, $timeBetweenVideos * 1000));
        videoElement.play();
        videoElement.style.opacity = 1;

        // Add this event listener to handle the video end event
        videoElement.onended = () => {
            clearTimeout(timeoutId);
            changeBackground();
        };

        $showBlackBackground = false;

        clearTimeout(timeoutId);

        const videoDuration = videoElement.duration;
        const maxDuration = 120; // 2 minute video max
        const timeToPlay = $videoPlayTime === 0 ? maxDuration : $videoPlayTime;
        const timeoutDuration = Math.min(videoDuration, timeToPlay) * 1000;
        timeoutId = setTimeout(changeBackground, timeoutDuration);
    }

    // Subscribe to the videoFiles store
    const unsubscribe = videoFiles.subscribe((value) => {
        videos = value;
        changeBackground()
    });

    // Unsubscribe from the store when the component is destroyed
    onDestroy(unsubscribe);
</script>

<style>
    .background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    }
    video {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }
    .black-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        z-index: -2;
        opacity: 0;
        transition: opacity 1s, z-index 1s;
    }
    .black-background.show {
        opacity: 1;
        z-index: 0; /* Change this value to ensure the black background is above the video */
    }
</style>

{#if videos[videoIndex]}
    <video
            id="background-video"
            class="background"
            src="/videos/{videos[videoIndex]}"
            muted
            preload="metadata"
    ></video>
{/if}
<div class="black-background" class:show="{$showBlackBackground}"></div>