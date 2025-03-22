import  { useState, useEffect } from 'react';

interface WeatherData {
  name: string;
  sys: { country: string };
  main: { temp: number; feels_like: number; humidity: number; pressure: number };
  weather: { id: number; description: string; icon: string; main: string }[];
  wind: { speed: number; deg: number };
  clouds: { all: number };
  dt: number;
}

type WeatherTheme = {
  bgGradient: string;
  textColor: string;
  icon: string;
};

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = '7304031ae1c29ed9c22da861e994e6f2';
  const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

  const getWeatherTheme = (weatherId: number, isDay: boolean): WeatherTheme => {
    if (weatherId === 800) {
      return isDay
        ? { bgGradient: 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600', textColor: 'text-white', icon: '☀️' }
        : { bgGradient: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800', textColor: 'text-white', icon: '🌙' };
    }
    if (weatherId >= 801 && weatherId <= 804) return { bgGradient: 'bg-gradient-to-br from-gray-300 to-gray-500', textColor: 'text-gray-800', icon: '☁️' };
    if ((weatherId >= 300 && weatherId <= 321) || (weatherId >= 500 && weatherId <= 531)) return { bgGradient: 'bg-gradient-to-br from-gray-600 to-gray-800', textColor: 'text-white', icon: '🌧️' };
    if (weatherId >= 600 && weatherId <= 622) return { bgGradient: 'bg-gradient-to-br from-gray-100 to-blue-100', textColor: 'text-gray-800', icon: '❄️' };
    if (weatherId >= 200 && weatherId <= 232) return { bgGradient: 'bg-gradient-to-br from-gray-800 to-gray-900', textColor: 'text-white', icon: '⛈️' };
    if (weatherId >= 700 && weatherId <= 781) return { bgGradient: 'bg-gradient-to-br from-gray-400 to-gray-600', textColor: 'text-white', icon: '🌫️' };
    return { bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-700', textColor: 'text-white', icon: '🌡️' };
  };

  const isDaytime = (iconCode: string): boolean => !iconCode.includes('n');

  const fetchWeatherByLocation = async (latitude: number, longitude: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
      if (!response.ok) throw new Error('Unable to fetch weather data');
      const data = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByLocation(latitude, longitude);
      },
      () => setError("Unable to retrieve your location. Please enable location access.")
    );
  }, []);

  const formatTime = (timestamp: number): string => new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (timestamp: number): string => new Date(timestamp * 1000).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const theme = weatherData
    ? getWeatherTheme(weatherData.weather[0].id, isDaytime(weatherData.weather[0].icon))
    : { bgGradient: 'bg-gradient-to-br from-blue-400 to-blue-600', textColor: 'text-white', icon: '🌡️' };

  return (
    <div className={`min-h-screen ${theme.bgGradient} ${theme.textColor} font-sans flex flex-col items-center justify-between p-8`}>
      {/* Loading Indicator */}
      {loading && (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-red-300 text-xl mb-4">{error}</p>
          <button
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherByLocation(latitude, longitude);
                  },
                  () => setError("Still unable to retrieve your location.")
                );
              }
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Weather Data - Full Page Layout */}
      {weatherData && !loading && (
        <div className="w-full max-w-4xl flex flex-col items-center justify-between h-full animate-fadeIn">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-2">{weatherData.name}, {weatherData.sys.country}</h1>
            <p className="text-xl opacity-80">{formatDate(weatherData.dt)}</p>
          </div>

          {/* Main Weather */}
          <div className="text-center mb-16">
            <div className="text-9xl mb-4">{theme.icon}</div>
            <div className="text-7xl font-bold mb-2">{Math.round(weatherData.main.temp)}°C</div>
            <p className="text-2xl capitalize">{weatherData.weather[0].description}</p>
          </div>

          {/* Weather Details with Icons */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 w-full text-center">
            <div>
              <span className="text-3xl">🌡️</span>
              <p className="text-sm opacity-70">Feels Like</p>
              <p className="text-xl font-semibold">{Math.round(weatherData.main.feels_like)}°C</p>
            </div>
            <div>
              <span className="text-3xl">💧</span>
              <p className="text-sm opacity-70">Humidity</p>
              <p className="text-xl font-semibold">{weatherData.main.humidity}%</p>
            </div>
            <div>
              <span className="text-3xl">💨</span>
              <p className="text-sm opacity-70">Wind</p>
              <p className="text-xl font-semibold">{Math.round(weatherData.wind.speed * 3.6)} km/h</p>
            </div>
            <div>
              <span className="text-3xl">🌡</span>
              <p className="text-sm opacity-70">Pressure</p>
              <p className="text-xl font-semibold">{weatherData.main.pressure} hPa</p>
            </div>
            <div>
              <span className="text-3xl">☁️</span>
              <p className="text-sm opacity-70">Cloudiness</p>
              <p className="text-xl font-semibold">{weatherData.clouds.all}%</p>
            </div>
          </div>

          {/* Footer with Time and Refresh */}
          <div className="mt-12 text-center">
            <p className="text-lg opacity-80 mb-4">Updated at: {formatTime(weatherData.dt)}</p>
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const { latitude, longitude } = position.coords;
                      fetchWeatherByLocation(latitude, longitude);
                    },
                    () => setError("Unable to retrieve your location.")
                  );
                }
              }}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-md transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;