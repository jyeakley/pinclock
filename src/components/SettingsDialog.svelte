<script>
    import {videoFiles, videoFadeOutTime, timeBetweenVideos, videoPlayTime} from '../videoStore.js';
    import {overriddenClockTime, clockTextShadow, clockSeparatorBlinkSpeed} from '../store.js';
    import {fontOptions, formatOptions} from '../settings/clockSettings.js'
    import {addVideosFromSource, clearVideos, fetchVideos, fetchVideoFolders} from '../services/videoService.js';
    import {onDestroy, onMount} from "svelte";

    export let showDialog;
    export let updateClockFont;
    export let clockFont;
    export let updateClockFormat;
    export let clockColor;
    export let updateClockColor;
    export let clockFontSize;
    export let clockPositionY;
    export let clockPositionX;
    export let updateClockVisibility;
    export let updateClockPositionY;
    export let clockFormatLabel;
    export let updateClockPositionX;
    export let randomizeVideos;
    export let showClock;
    export let updateRandomizeVideos;
    export let updateClockFontSize;
    let videos;
    let manualTime = "";
    let folders = [];
    let selected = "";

    function updateClockSeparatorBlinkSpeed(event) {
        const blinkValue = parseFloat(event.target.value);
        $clockSeparatorBlinkSpeed = blinkValue;
        localStorage.setItem("clockSeparatorBlinkSpeed", $clockSeparatorBlinkSpeed);
    }

    // Add this function in the <script> section
    function updateClockTextShadow(event) {
        const value = event.target.value;
        $clockTextShadow = parseInt(value);
        localStorage.setItem("clockTextShadow", $clockTextShadow);
    }

    // Add these functions in the <script> section
    function updateVideoFadeOutTime(event) {
        const value = parseFloat(event.target.value);
        $videoFadeOutTime = value;
        localStorage.setItem("videoFadeOutTime", $videoFadeOutTime);
    }

    function updateTimeBetweenVideos(event) {
        const value = parseFloat(event.target.value);
        $timeBetweenVideos = value;
        localStorage.setItem("timeBetweenVideos", $timeBetweenVideos);
    }

    function updateVideoPlayTime(event) {
        const value = parseFloat(event.target.value);
        $videoPlayTime = value;
        localStorage.setItem("videoPlayTime", $videoPlayTime);
    }

    function updateManualTime(event) {
        const value = event.target.value;
        $overriddenClockTime = value ? new Date(value) : null;
        localStorage.setItem('overriddenClockTime', $overriddenClockTime ? $overriddenClockTime.toISOString() : null);
        manualTime = value;
    }

    async function loadFolders() {
        folders = await fetchVideoFolders();
    }

    function updateSelectedFolders(event, folder) {
        console.log("updateSelectedFolders");
        let selectedArray = selected.length > 0 ? selected.split(",") : [];

        if (event.target.checked) {
            selectedArray.push(folder);
        } else {
            selectedArray = selectedArray.filter((f) => f !== folder);
        }

        selected = selectedArray.join(",");
        localStorage.setItem("selectedFolders", selected);
        fetchVideos(selectedArray.length > 0 ? selectedArray : null);
    }

    onMount(() => {
        loadFolders();

        const savedOverriddenClockTime = localStorage.getItem("overriddenClockTime");
        const savedClockTextShadow = localStorage.getItem("clockTextShadow");
        const savedVideoFadeOutTime = localStorage.getItem("videoFadeOutTime");
        const savedTimeBetweenVideos = localStorage.getItem("timeBetweenVideos");
        const savedSelectedFolders = localStorage.getItem("selectedFolders");
        const savedClockSeparatorBlinkSpeed = localStorage.getItem("clockSeparatorBlinkSpeed");

        if (savedOverriddenClockTime !== null && savedOverriddenClockTime !== 'null') {
            const savedDate = new Date(savedOverriddenClockTime);
            const localDate = new Date(savedDate.getTime() - savedDate.getTimezoneOffset() * 60000);
            manualTime = localDate.toISOString().slice(0, 19);
        }
        if (savedClockTextShadow) {
            $clockTextShadow = parseInt(savedClockTextShadow);
        }
        if (savedVideoFadeOutTime) {
            $videoFadeOutTime = parseFloat(savedVideoFadeOutTime);
        }
        if (savedTimeBetweenVideos) {
            $timeBetweenVideos = parseFloat(savedTimeBetweenVideos);
        }
        if (savedSelectedFolders) {
            selected = savedSelectedFolders;
        }
        if (savedClockSeparatorBlinkSpeed) {
            $clockSeparatorBlinkSpeed = parseFloat(savedClockSeparatorBlinkSpeed);
        }
    });

    // Subscribe to the videoFiles store
    const unsubscribe = videoFiles.subscribe((value) => {
        videos = value;
    });

    // Unsubscribe from the store when the component is destroyed
    onDestroy(unsubscribe);
</script>

<style>
    .settings {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        border: 1px solid black;
        padding: 1rem;
        z-index: 2;
        display: flex;
        flex-direction: column;
        max-height: 90vh;
        overflow-y: auto;
        margin-bottom: 1rem;
        border-radius: 10px;
        width: 90%;
        max-width: 475px;
        box-sizing: border-box;
    }

    @media screen and (min-height: 600px) {
        .settings {
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }

    @media screen and (max-height: 599px) {
        .settings {
            top: 0;
            transform: translate(-50%, 0);
            height: 100vh;
        }
    }


    .settings-container {
        display: flex;
        flex-direction: column;
    }

    .setting-label {
        display: block;
        margin-bottom: 0.1rem;
    }

    .settings select {
        margin-left: 0.5rem;
    }
</style>

{#if showDialog}
    <div class="settings" on:stopPropagation>
        <div class="settings-container">
            <label class="setting-label">
                Clock font:
                <select bind:value={$clockFont} on:change={updateClockFont}>
                    {#each fontOptions as font}
                        <option value={font.value}>
                            {font.label}
                        </option>
                    {/each}
                </select>
            </label>
            <div class="font-preview" style="font-family: {$clockFont};">
                The quick brown fox jumps over the lazy dog
            </div>
            <br/>
            <label class="setting-label">
                Clock format:
                <select on:change={updateClockFormat}>
                    {#each formatOptions as option}
                        <option value={JSON.stringify(option)}
                                selected={option.label === clockFormatLabel}>{option.label}</option>
                    {/each}
                </select>
            </label>
            <br/>
            <label class="setting-label">
                Manual clock time (yyyy-mm-ddThh:mm:ss):
                <input type="datetime-local" bind:value="{manualTime}" on:change="{updateManualTime}" />
            </label>
            <br />
            <label class="setting-label">
                Clock text shadow:
                <input type="range" min="0" max="30" bind:value={$clockTextShadow} on:change="{updateClockTextShadow}"/>
            </label>
            <br/>
            <label class="setting-label">
                Clock separator blink speed (0 for solid, 1 for default, higher for slower):
                <input type="range" min="0" step=".1" max="5" bind:value={$clockSeparatorBlinkSpeed} on:change="{updateClockSeparatorBlinkSpeed}"/>
            </label>
            <br/>
            <label class="setting-label">
                Clock color:
                <input type="color" value={clockColor} on:change="{updateClockColor}"/>
            </label>
            <br/>
            <label class="setting-label">
                Clock font size:
                <input type="range" min="10" max="550" value={parseInt(clockFontSize)}
                       on:change="{updateClockFontSize}"/>
            </label>
            <br/>
            <label class="setting-label">
                Clock position X:
                <input type="range" min="-1500" max="1500" value={$clockPositionX} on:change={updateClockPositionX}/>

            </label>
            <br/>
            <label class="setting-label">
                Clock position Y:
                <input type="range" min="-1500" max="1000" value={$clockPositionY} on:change={updateClockPositionY}/>
            </label>
            <br/>
            <label class="setting-label">
                Always show clock:
                <input type="checkbox" checked="{showClock}" on:change="{updateClockVisibility}"/>
            </label>
            <br/>
            <label class="setting-label">
                Video fade time (seconds, Default: 0):
                <input type="number" min="0" step="1" bind:value={$videoFadeOutTime} on:change="{updateVideoFadeOutTime}"/>
            </label>
            <br/>
            <label class="setting-label">
                Time between videos (seconds, Default: 3):
                <input type="number" min="0" step="1" bind:value={$timeBetweenVideos} on:change="{updateTimeBetweenVideos}"/>
            </label>
            <br/>
            <label class="setting-label">
                Video Play Time (seconds, Default: 5):
                <input type="number" min="1" step="1" bind:value={$videoPlayTime} on:change="{updateVideoPlayTime}"/>
            </label>
            <br/>
            <button on:click={fetchVideos}>Refresh Videos</button>
            <br/>
            <div>
                <h4>Select video folders (All will play if none selected):</h4>
                {#each folders as folder}
                    <label class="setting-label">
                        <input type="checkbox" checked="{selected.includes(folder)}" on:change="{(event) => updateSelectedFolders(event, folder)}" /> {folder}
                    </label>
                {/each}
            </div>
            <br/>
            <p>Number of videos: {videos.length}</p>
            <label class="setting-label">
                Randomize videos:
                <input type="checkbox" bind:checked={$randomizeVideos} on:change="{updateRandomizeVideos}"/>
            </label>
            <br/>
            <button on:click={addVideosFromSource}>Sync Videos From USB</button>
            <br/>
            <br/>
            <label class="setting-label">
                Clear all videos:
                <button on:click="{clearVideos}">Clear</button>
            </label>
            <br/>
        </div>
    </div>
{/if}