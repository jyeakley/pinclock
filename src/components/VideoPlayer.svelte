<script>
    import { videoFiles, showBlackBackground } from '../videoStore.js';
    import { onMount } from 'svelte';
    import {onDestroy} from "svelte";
    export let videoIndex;
    // export let showBlackBackground;
    export let randomizeVideos;
    let videos;

    onMount(() => {
        changeBackground();
    });

    async function changeBackground() {
        console.log($randomizeVideos)
        $showBlackBackground = true;
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Select a video based on the randomizeVideos setting
        if ($randomizeVideos) {
            const randomIndex = Math.floor(Math.random() * videos.length);
            videoIndex = randomIndex;
        } else {
            videoIndex = (videoIndex + 1) % videos.length;
        }

        const videoElement = document.getElementById("background-video");
        videoElement.src = `/videos/${encodeURIComponent(videos[videoIndex])}`;
        videoElement.play();
        await new Promise((resolve) => setTimeout(resolve, 4000));
        $showBlackBackground = false;

        setTimeout(changeBackground, 5000);
    }

    // Subscribe to the videoFiles store
    const unsubscribe = videoFiles.subscribe((value) => {
        videos = value;
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

<video
        id="background-video"
        class="background"
        src="/videos/{videos[videoIndex]}"
        preload = 'metadata'
        autoplay
        loop
        muted
        on:ended={changeBackground}
></video>
<div class="black-background" class:show="{$showBlackBackground}"></div>