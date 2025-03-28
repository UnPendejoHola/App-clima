const cityInput = document.getElementById('city-input');
const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
const recentSearches = document.getElementById('recent-searches');

const loader = document.createElement('div');
loader.className = 'loader';
document.querySelector('.container').appendChild(loader);

const API_KEY = '48dc5d02c402a6fe702db41558703bab';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

let recentSearchList = [];

searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchWeather();
    }
});

function searchWeather() {
    const city = cityInput.value.trim();
    const country = countryInput.value.trim();
    
    if (city === '') {
        showError('Por favor, ingresa el nombre de una ciudad.');
        return;
    }
    
    let query = city;
    if (country) {
        query = `${city},${country}`;
    }
    
    getWeather(query);
}

async function getWeather(query) {
    showLoader();
    hideWeatherInfo();
    hideError();
    
    try {
        console.log(`Buscando: ${query}`);
        
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(query)}&appid=${API_KEY}&units=metric&lang=es`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        displayWeather(data);
        hideError();
        
        addToRecentSearches(data.name, data.sys.country);
    } catch (error) {
        console.error('Error al obtener datos del clima:', error);
        
        if (query.includes(',')) {
            try {
                const [cityName, countryCode] = query.split(',');
                await searchByGeocode(cityName.trim(), countryCode.trim());
                return;
            } catch (geoError) {
                console.error('Error en búsqueda por geocodificación:', geoError);
            }
        }
        
        if (query.includes(',')) {
            showError(`No se pudo encontrar "${query}". Por favor, verifica el nombre de la ciudad y el país.`);
        } else {
            showError('No se pudo encontrar la ciudad. Intenta seleccionar un país del menú desplegable.');
        }
        
        hideWeatherInfo();
    } finally {
        hideLoader();
    }
}

async function searchByGeocode(city, country) {
    console.log(`Intentando geocodificación para: ${city}, ${country}`);
    
    const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&limit=1&appid=${API_KEY}`
    );
    
    if (!geoResponse.ok) {
        throw new Error('Error en geocodificación');
    }
    
    const geoData = await geoResponse.json();
    console.log('Datos de geocodificación:', geoData);
    
    if (!geoData || geoData.length === 0) {
        throw new Error('No se encontraron resultados de geocodificación');
    }
    
    const { lat, lon } = geoData[0];
    
    const weatherResponse = await fetch(
        `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
    );
    
    if (!weatherResponse.ok) {
        throw new Error('Error obteniendo clima por coordenadas');
    }
    
    const weatherData = await weatherResponse.json();
    displayWeather(weatherData);
    hideError();
    
    addToRecentSearches(weatherData.name, weatherData.sys.country);
}

function addToRecentSearches(city, country) {
    const searchTerm = { city, country };
    
    if (!recentSearchList.some(item => 
        item.city.toLowerCase() === city.toLowerCase() && 
        item.country === country)) {
        
        recentSearchList.unshift(searchTerm);
        
        if (recentSearchList.length > 5) {
            recentSearchList.pop();
        }
        
        localStorage.setItem('recentWeatherSearches', JSON.stringify(recentSearchList));
        
        updateRecentSearchesUI();
    }
}

function updateRecentSearchesUI() {
    if (recentSearchList.length === 0) {
        recentSearches.style.display = 'none';
        return;
    }
    
    recentSearches.innerHTML = '';
    
    const title = document.createElement('h3');
    title.textContent = 'Búsquedas recientes:';
    recentSearches.appendChild(title);
    
    recentSearchList.forEach(search => {
        const item = document.createElement('div');
        item.className = 'recent-search-item';
        item.textContent = `${search.city}, ${search.country}`;
        item.addEventListener('click', () => {
            cityInput.value = search.city;
            
            countryInput.value = search.country;
            
            searchWeather();
        });
        recentSearches.appendChild(item);
    });
    
    recentSearches.style.display = 'block';
}

function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    humidity.textContent = `Humedad: ${data.main.humidity}%`;
    windSpeed.textContent = `Viento: ${data.wind.speed} m/s`;
    
    weatherInfo.classList.add('weather-card-effect');
    
    weatherInfo.style.display = 'block';
    
    setBackgroundByTemperature(data.main.temp);
    
    updateTemperatureClass(data.main.temp);
}

function setBackgroundByTemperature(temp) {
    let gradient;
    
    if (temp < 5) {
        gradient = 'linear-gradient(135deg, #00416a, #e4e5e6)';
    } else if (temp < 15) {
        gradient = 'linear-gradient(135deg, #2980b9, #6dd5fa)';
    } else if (temp < 25) {
        gradient = 'linear-gradient(135deg, #00b4db, #0083b0)';
    } else if (temp < 30) {
        gradient = 'linear-gradient(135deg, #ff7e5f, #feb47b)';
    } else {
        gradient = 'linear-gradient(135deg, #f12711, #f5af19)';
    }
    
    document.body.style.background = gradient;
}

function updateTemperatureClass(temp) {
    weatherInfo.classList.remove('cold', 'cool', 'mild', 'warm', 'hot');
    
    if (temp < 5) {
        weatherInfo.classList.add('cold');
    } else if (temp < 15) {
        weatherInfo.classList.add('cool');
    } else if (temp < 25) {
        weatherInfo.classList.add('mild');
    } else if (temp < 30) {
        weatherInfo.classList.add('warm');
    } else {
        weatherInfo.classList.add('hot');
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function hideWeatherInfo() {
    weatherInfo.style.display = 'none';
}

function showLoader() {
    loader.style.display = 'block';
}

function hideLoader() {
    loader.style.display = 'none';
}

window.addEventListener('load', () => {
    searchBtn.style.animation = 'pulse 2s infinite';
    
    const savedSearches = localStorage.getItem('recentWeatherSearches');
    if (savedSearches) {
        try {
            recentSearchList = JSON.parse(savedSearches);
            updateRecentSearchesUI();
        } catch (e) {
            console.error('Error al cargar búsquedas recientes:', e);
            localStorage.removeItem('recentWeatherSearches');
        }
    }
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                getWeatherByCoordinates(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.log('Error obteniendo ubicación:', error);
                cityInput.value = 'Madrid';
                countryInput.value = 'ES';
                searchWeather();
            }
        );
    } else {
        cityInput.value = 'Madrid';
        countryInput.value = 'ES';
        searchWeather();
    }
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);
});

async function getWeatherByCoordinates(lat, lon) {
    showLoader();
    hideWeatherInfo();
    hideError();
    
    try {
        const response = await fetch(
            `${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`
        );
        
        if (!response.ok) {
            throw new Error('No se pudo obtener el clima para tu ubicación');
        }
        
        const data = await response.json();
        cityInput.value = data.name;
        
        countryInput.value = data.sys.country;
        
        displayWeather(data);
        
        addToRecentSearches(data.name, data.sys.country);
    } catch (error) {
        console.error('Error obteniendo clima por coordenadas:', error);
        cityInput.value = 'Madrid';
        countryInput.value = 'ES';
        searchWeather();
    } finally {
        hideLoader();
    }
}