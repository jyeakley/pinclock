// src/store.js
import { writable } from 'svelte/store';

export const clockFont = writable('Courier New');
export const clockPositionX = writable(50);
export const clockPositionY = writable(50);
export const overriddenClockTime = writable(null);
export const clockFormat = writable('{ label: \'HH:mm:ss\', value: { hour: \'2-digit\', minute: \'2-digit\', second: \'2-digit\', hour12: false } }');
export const clockTextShadow = writable(0);
export const clockSeparatorBlinkSpeed = writable(0);