export async function fetchWeatherData(api_key, zipCode) {
    const apiUrl = "https://api.weatherapi.com/v1/current.json?key="+ api_key +"&q="+ zipCode +"&aqi=no";
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch weather data:', response.status, response.statusText);
            return null; // Return null when the request fails
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null; // Return null when the request fails
    }
}