import { writable } from 'svelte/store';

export const videoFiles = writable([]);
export const showBlackBackground = writable(true);
export const videoFadeOutTime = writable(0);
export const timeBetweenVideos = writable(3);
export const videoPlayTime = writable(5);