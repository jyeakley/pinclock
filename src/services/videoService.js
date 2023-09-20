import { videoFiles } from '../videoStore.js';

const HOSTNAME_URL = import.meta.env.VITE_HOSTNAME_URL || 'http://localhost:3001';

export async function fetchVideos(folders = null) {
    try {
        console.log(import.meta.env.VITE_HOSTNAME_URL)
        const folderParam = folders !== null && folders.length > 0 ? "?folders=" + folders : "";
        const response = await fetch(HOSTNAME_URL + "/api/videos" + folderParam);

        if (response.ok) {
            const files = await response.json();
            videoFiles.set(files);
        } else {
            console.error("Error fetching video files");
        }
    } catch (e) {
        console.error("Error fetching video files");
    }
}

export async function addVideosFromSource() {
    try {
        const response = await fetch(HOSTNAME_URL + "/api/add_videos_from_source", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            await fetchVideos();
        } else {
            console.error("Error adding videos from source");
        }
    } catch (err) {
        console.error(err);
    }
}

export async function clearVideos() {
    try {
        const response = await fetch(HOSTNAME_URL + '/api/clear_videos', { method: 'DELETE' });

        if (response.ok) {
            const result = await response.json();
            console.log(result.message);
            await fetchVideos();
        } else {
            console.error('Error clearing videos');
        }
    } catch (err) {
        console.error(err);
    }
}

export async function fetchVideoFolders() {
    const response = await fetch(HOSTNAME_URL + '/api/video-folders');
    return await response.json();
}
