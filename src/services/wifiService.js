
const HOSTNAME_URL = import.meta.env.VITE_HOSTNAME_URL || 'http://localhost:3001';

export async function scanWifiNetworks() {
    try {
        const response = await fetch(HOSTNAME_URL + '/api/wifi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'scan' }),
        });
        const data = await response.json();
        if(data.result){
            const networks = data.result.split('\n').map(network => {
                return { ssid: network.replace('ESSID:', '').trim() };
            });
            return networks;
        }else{
            return []
        }
    } catch (error) {
        console.error('Failed to scan Wi-Fi networks:', error);
        return [];
    }
}

export async function connectToWifi(ssid, password) {
    try {
        const response = await fetch(HOSTNAME_URL + '/api/wifi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'connect', ssid, password }),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to connect to Wi-Fi:', error);
        return { error: error.message };
    }
}
