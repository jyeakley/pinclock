<script>
    export let weatherData;
    let location = weatherData.location;
    let current = weatherData.current;
    let condition = current.condition;
</script>

<style>
    .weather-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Arial, sans-serif;
        background-color: white;
        border: 3px solid black;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        position: relative;
        z-index: 1;
        width: 15em;
    }

    .refresh-icon {
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 10px;
        width: 24px;
        height: 24px;
    }

    .location {
        font-size: 1.5em;
        font-weight: bold;
    }

    .temperature {
        font-size: 1.5em;
    }

    .condition {
        font-size: 1.25em;
    }

    img.condition-icon {
        width: 48px;
        height: 48px;
    }
</style>

<div class="weather-container">
    <div class="location">{location.name}, {location.region}, {location.country}</div>
    <div class="temperature">{current.temp_c}°C / {current.temp_f}°F</div>
    <div class="condition">
        <img class="condition-icon" src="{condition.icon}" alt="{condition.text}" />
        {condition.text}
    </div>
</div>
