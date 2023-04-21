import { videoFiles } from '../videoStore.js';

export async function fetchVideos() {
    const response = await fetch("http://localhost:3001/api/videos");
    if (response.ok) {
        const files = await response.json();
        videoFiles.set(files);
    } else {
        console.error("Error fetching video files");
    }
}

export async function addVideosFromSource() {
    try {
        const response = await fetch("http://localhost:3001/api/add_videos_from_source", {
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
        const response = await fetch('http://localhost:3001/api/clear_videos', { method: 'DELETE' });

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
