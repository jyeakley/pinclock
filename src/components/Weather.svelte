<script>
    export let weatherData;
    $: location = weatherData.location;
    $: current = weatherData.current;
    $: condition = current.condition;
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
        width: 12em;
    }

    .location {
        font-size: 1em;
        font-weight: bold;
    }

    .temperature {
        font-size: 1.3em;
    }

    .temperature-feel {
        font-size: .9em;
    }

    .condition {
        font-size: .9em;
    }
    .updated {
        font-size: .7em;
        color: grey;
    }
    img.condition-icon {
        width: 24px;
        height: 24px;
    }
</style>

<div class="weather-container">
    <div class="location">{location.name}, {location.region}, {location.country}</div>
    <div class="condition">
        <span class="temperature">{current.temp_f}°F
            <img class="condition-icon" src="{condition.icon}" alt="{condition.text}" />
            {condition.text}
        </span>

    </div>

    <div class="temperature-feel">Feels Like: {current.feelslike_f}°F</div>
    <div class="temperature-feel">Wind: {current.wind_mph}mph ({current.wind_dir}) </div>

    <br/>
    <div class="updated">Last Refresh: {location.localtime}</div>
</div>
