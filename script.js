console.log('Script loaded!');

const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('cityInput');

searchBtn.addEventListener('click', async () => {   // ← added async
    const cityName = cityInput.value.trim();
    if (!cityName) return;

    let result = document.getElementById('weatherResult');

    try {
        const geoRes = await fetch(   // ← added await
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`  // ← fixed: city -> cityName
        );
        const geoData = await geoRes.json();   // ← added await

        if (!geoData.results || geoData.results.length === 0) {
            result.textContent = 'City not found.';
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherRes = await fetch(   // ← added await
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const weatherData = await weatherRes.json();   // ← added await
        const temp = weatherData.current_weather.temperature;
        const windSpeed = weatherData.current_weather.windspeed;

        result.innerHTML = `
            <h2>${name}, ${country}</h2>
            <p>Temperature: ${temp}°C</p>
            <p>Wind Speed: ${windSpeed} km/h</p>
        `;
    } catch (error) {
        result.textContent = 'Error fetching weather data.';
        console.error(error);
    }
});