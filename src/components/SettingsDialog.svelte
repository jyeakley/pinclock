<script>
    import {videoFiles} from '../videoStore.js';
    import {addVideosFromSource, clearVideos, fetchVideos} from '../services/videoService.js';
    import {onDestroy} from "svelte";

    export let showDialog;
    export let updateClockFont;
    export let fontOptions;
    export let clockFont;
    export let updateClockFormat;
    export let formatOptions;
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
        max-width: 450px;
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
                <input type="range" min="0" max="1500" value={$clockPositionX} on:change={updateClockPositionX}/>

            </label>
            <br/>
            <label class="setting-label">
                Clock position Y:
                <input type="range" min="0" max="1000" value={$clockPositionY} on:change={updateClockPositionY}/>
            </label>
            <br/>
            <label class="setting-label">
                Always show clock:
                <input type="checkbox" checked="{showClock}" on:change="{updateClockVisibility}"/>
            </label>
            <br/>
            <button on:click={fetchVideos}>Refresh Videos</button>
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
                Clear all vidoes:
                <button on:click="{clearVideos}">Clear</button>
            </label>
            <br/>
        </div>
    </div>
{/if}