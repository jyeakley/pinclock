<script>
    import {
        showBlackBackground,
        timeBetweenVideos,
        videoFadeOutTime,
        videoFiles,
        videoPlayTime
    } from '../videoStore.js';
    import {fetchVideos} from '../services/videoService.js';
    import {onDestroy, onMount} from 'svelte';

    export let videoIndex;
    export let randomizeVideos;
    let videos;
    let timeoutId;
    let selected = [];
    let videoElement;
    let isVideoLoaded = false;

    onMount(() => {
        const savedVideoFadeOutTime = localStorage.getItem("videoFadeOutTime");
        const savedTimeBetweenVideos = localStorage.getItem("timeBetweenVideos");
        const savedVideoPlayTime = localStorage.getItem("videoPlayTime");
        const savedSelectedFolders = localStorage.getItem("selectedFolders");

        if (savedVideoFadeOutTime) {
            $videoFadeOutTime = parseFloat(savedVideoFadeOutTime);
        }
        if (savedTimeBetweenVideos) {
            $timeBetweenVideos = parseFloat(savedTimeBetweenVideos);
        }
        if (savedVideoPlayTime) {
            $videoPlayTime = parseFloat(savedVideoPlayTime);
        }
        if (savedSelectedFolders) {
            selected = savedSelectedFolders.split(",");
        }

        setTimeout(changeBackground);

        if (videos.length === 0 || videoIndex >= videos.length) {
            console.log("SAVED VP 2: " + selected);
            fetchVideos(selected.length > 0 ? selected : null);
        } else {
            changeBackground();
        }
    });

    function handleVideoLoadedMetadata() {
        isVideoLoaded = true;
    }

    async function changeBackground() {
        $showBlackBackground = true;
        if (videos.length === 0) {
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Select a video based on the randomizeVideos setting
        if ($randomizeVideos) {
            videoIndex = Math.floor(Math.random() * videos.length);
        } else {
            videoIndex = (videoIndex + 1) % videos.length;
        }

        if (!videos[videoIndex] || videos[videoIndex] === 'undefined') {
        try {
            await fetchVideos(selected.length > 0 ? selected : null);
        } catch (error) {
            console.error("Failed to fetch videos: ", error);
            // Handle the error, e.g., show a message or retry after some time
            return;
        }
            return;
        }

        isVideoLoaded = false;
        if(videoElement != null) {
            videoElement.src = `/videos/${encodeURIComponent(videos[videoIndex])}`;
            videoElement.style.transition = `opacity ${$videoFadeOutTime}s`;
            videoElement.style.opacity = 0;
            await new Promise((resolve) => {
                videoElement.addEventListener('loadedmetadata', resolve, { once: true });
            });
            await new Promise((resolve) => setTimeout(resolve, $timeBetweenVideos * 1000));
            try {
                await videoElement.play();
            } catch (error) {
                console.error("Playback error: ", error);
                // Handle playback errors here
                return;
            }
            videoElement.style.opacity = 1;
            videoElement.onended = handleVideoEnded;

            $showBlackBackground = false;

            clearTimeout(timeoutId);

            const videoDuration = videoElement.duration;
            const maxDuration = 120;
            const timeToPlay = $videoPlayTime === 0 ? maxDuration : $videoPlayTime;
            const timeoutDuration = Math.min(videoDuration, timeToPlay) * 1000;
            timeoutId = setTimeout(changeBackground, timeoutDuration);
        }else{
            if (typeof document !== 'undefined') {
                videoElement = document.getElementById("background-video");
                videoElement.addEventListener('loadedmetadata', handleVideoLoadedMetadata);
            }
        }
    }

    function handleVideoEnded() {
        clearTimeout(timeoutId);
        videoElement.onended = null; // Remove the event listener
        changeBackground();
    }

    // Subscribe to the videoFiles store
    const unsubscribe = videoFiles.subscribe((value) => {
        videos = value;
        if (videos.length > 0) {
            changeBackground();
        }
        // if (videos.length === 0 || videoIndex >= videos.length) {
        //     console.log("SAVED VP 2: " + selected);
        //     fetchVideos(selected.length > 0 ? selected : null);
        // } else {
        //     changeBackground();
        // }
    });

    onDestroy(() => {
        unsubscribe();
        if (videoElement) {
            videoElement.onended = null; // Remove the event listener
        }
    });
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
            playsinline
    ></video>
{/if}
<div class="black-background" class:show="{$showBlackBackground}"></div>