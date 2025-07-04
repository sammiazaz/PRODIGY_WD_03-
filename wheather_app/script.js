class WeatherApp {
    constructor() {
        this.API_KEY = this.getApiKey();
        this.BASE_URL = 'https://api.openweathermap.org/data/2.5';
        this.currentUnit = 'celsius';
        this.currentWeatherData = null;
        this.currentLocation = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateCurrentDate();
    }
    
    getApiKey() {
        // Check if the API key is available in the global scope (injected by server)
        if (typeof window !== 'undefined' && window.OPENWEATHER_API_KEY) {
            return window.OPENWEATHER_API_KEY;
        }
        
        // Fallback to localStorage for development
        if (typeof window !== 'undefined') {
            return localStorage.getItem('OPENWEATHER_API_KEY') || 'your_api_key_here';
        }
        
        return 'your_api_key_here';
    }
    
    initializeElements() {
        this.elements = {
            cityInput: document.getElementById('cityInput'),
            searchBtn: document.getElementById('searchBtn'),
            locationBtn: document.getElementById('locationBtn'),
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            weatherDisplay: document.getElementById('weatherDisplay'),
            retryBtn: document.getElementById('retryBtn'),
            errorMessage: document.getElementById('errorMessage'),
            
            // Weather display elements
            cityName: document.getElementById('cityName'),
            countryName: document.getElementById('countryName'),
            currentDate: document.getElementById('currentDate'),
            weatherIcon: document.getElementById('weatherIcon'),
            temperature: document.getElementById('temperature'),
            weatherDesc: document.getElementById('weatherDesc'),
            feelsLike: document.getElementById('feelsLike'),
            
            // Detail elements
            visibility: document.getElementById('visibility'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            pressure: document.getElementById('pressure'),
            uvIndex: document.getElementById('uvIndex'),
            windDirection: document.getElementById('windDirection'),
            
            // Temperature unit buttons
            celsiusBtn: document.getElementById('celsiusBtn'),
            fahrenheitBtn: document.getElementById('fahrenheitBtn')
        };
    }
    
    bindEvents() {
        this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
        this.elements.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
        
        this.elements.locationBtn.addEventListener('click', () => this.getCurrentLocation());
        this.elements.retryBtn.addEventListener('click', () => this.handleRetry());
        
        this.elements.celsiusBtn.addEventListener('click', () => this.switchUnit('celsius'));
        this.elements.fahrenheitBtn.addEventListener('click', () => this.switchUnit('fahrenheit'));
    }
    
    updateCurrentDate() {
        const now = new Date();
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        this.elements.currentDate.textContent = now.toLocaleDateString('en-US', options);
    }
    
    showLoading() {
        this.elements.loadingState.classList.remove('hidden');
        this.elements.errorState.classList.add('hidden');
        this.elements.weatherDisplay.classList.add('hidden');
    }
    
    showError(message) {
        this.elements.errorState.classList.remove('hidden');
        this.elements.loadingState.classList.add('hidden');
        this.elements.weatherDisplay.classList.add('hidden');
        this.elements.errorMessage.textContent = message;
    }
    
    showWeather() {
        this.elements.weatherDisplay.classList.remove('hidden');
        this.elements.loadingState.classList.add('hidden');
        this.elements.errorState.classList.add('hidden');
    }
    
    async handleSearch() {
        const city = this.elements.cityInput.value.trim();
        if (!city) {
            this.showError('Please enter a city name');
            return;
        }
        
        await this.fetchWeatherByCity(city);
    }
    
    async handleRetry() {
        if (this.currentLocation) {
            await this.fetchWeatherByCoords(this.currentLocation.lat, this.currentLocation.lon);
        } else {
            this.showError('No previous location to retry. Please search for a city or use your location.');
        }
    }
    
    async getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return;
        }
        
        this.showLoading();
        
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 10000,
                    enableHighAccuracy: true
                });
            });
            
            const { latitude, longitude } = position.coords;
            this.currentLocation = { lat: latitude, lon: longitude };
            await this.fetchWeatherByCoords(latitude, longitude);
            
        } catch (error) {
            let errorMessage = 'Unable to get your location. ';
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Location access denied. Please enable location services and try again.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'An unknown error occurred.';
            }
            
            this.showError(errorMessage);
        }
    }
    
    async fetchWeatherByCity(city) {
        this.showLoading();
        
        try {
            const response = await fetch(
                `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`
            );
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.currentWeatherData = data;
            this.currentLocation = { lat: data.coord.lat, lon: data.coord.lon };
            
            await this.fetchAdditionalData(data.coord.lat, data.coord.lon);
            this.displayWeather(data);
            
        } catch (error) {
            console.error('Error fetching weather by city:', error);
            this.showError(`Unable to fetch weather for "${city}". ${error.message}`);
        }
    }
    
    async fetchWeatherByCoords(lat, lon) {
        this.showLoading();
        
        try {
            const response = await fetch(
                `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
            );
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.currentWeatherData = data;
            
            await this.fetchAdditionalData(lat, lon);
            this.displayWeather(data);
            
        } catch (error) {
            console.error('Error fetching weather by coordinates:', error);
            this.showError(`Unable to fetch weather data. ${error.message}`);
        }
    }
    
    async fetchAdditionalData(lat, lon) {
        try {
            // Fetch UV Index data
            const uvResponse = await fetch(
                `${this.BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`
            );
            
            if (uvResponse.ok) {
                const uvData = await uvResponse.json();
                this.currentWeatherData.uvi = uvData.value;
            }
        } catch (error) {
            console.error('Error fetching additional data:', error);
            // Don't show error for additional data, just log it
        }
    }
    
    displayWeather(data) {
        // Update location info
        this.elements.cityName.textContent = data.name;
        this.elements.countryName.textContent = data.sys.country;
        
        // Update weather icon
        const iconCode = data.weather[0].icon;
        this.elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        this.elements.weatherIcon.alt = data.weather[0].description;
        
        // Update temperature
        this.updateTemperatureDisplay(data.main.temp);
        
        // Update weather description
        this.elements.weatherDesc.textContent = data.weather[0].description;
        this.elements.feelsLike.textContent = `Feels like ${this.formatTemperature(data.main.feels_like)}`;
        
        // Update weather details
        this.elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
        this.elements.humidity.textContent = `${data.main.humidity}%`;
        this.elements.windSpeed.textContent = `${data.wind.speed} m/s`;
        this.elements.pressure.textContent = `${data.main.pressure} hPa`;
        this.elements.windDirection.textContent = this.getWindDirection(data.wind.deg);
        
        // Update UV Index if available
        if (data.uvi !== undefined) {
            this.elements.uvIndex.textContent = `${data.uvi} ${this.getUVIndexLevel(data.uvi)}`;
        } else {
            this.elements.uvIndex.textContent = 'N/A';
        }
        
        this.showWeather();
    }
    
    updateTemperatureDisplay(temp) {
        const displayTemp = this.currentUnit === 'celsius' ? temp : this.celsiusToFahrenheit(temp);
        this.elements.temperature.textContent = `${Math.round(displayTemp)}°`;
    }
    
    formatTemperature(temp) {
        const displayTemp = this.currentUnit === 'celsius' ? temp : this.celsiusToFahrenheit(temp);
        const unit = this.currentUnit === 'celsius' ? '°C' : '°F';
        return `${Math.round(displayTemp)}${unit}`;
    }
    
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }
    
    switchUnit(unit) {
        this.currentUnit = unit;
        
        // Update button states
        this.elements.celsiusBtn.classList.toggle('active', unit === 'celsius');
        this.elements.fahrenheitBtn.classList.toggle('active', unit === 'fahrenheit');
        
        // Update display if weather data is available
        if (this.currentWeatherData) {
            this.updateTemperatureDisplay(this.currentWeatherData.main.temp);
            this.elements.feelsLike.textContent = `Feels like ${this.formatTemperature(this.currentWeatherData.main.feels_like)}`;
        }
    }
    
    getWindDirection(degrees) {
        const directions = [
            'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
        ];
        
        const index = Math.round(degrees / 22.5) % 16;
        return `${directions[index]} (${degrees}°)`;
    }
    
    getUVIndexLevel(uvi) {
        if (uvi <= 2) return '(Low)';
        if (uvi <= 5) return '(Moderate)';
        if (uvi <= 7) return '(High)';
        if (uvi <= 10) return '(Very High)';
        return '(Extreme)';
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});
