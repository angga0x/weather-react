import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, addHours, isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { FaInstagram, FaGithub, FaTiktok } from 'react-icons/fa';
import WeatherCard from './components/WeatherCard';
import type { WeatherResponse, WeatherData } from './types/weather';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [countdown, setCountdown] = useState(60);
  const [isDark, setIsDark] = useState(true);

  const findNextWeatherData = (weatherTimes: any[], currentTime: Date) => {
    // Sort weather times by datetime
    const sortedTimes = [...weatherTimes].sort((a, b) => 
      new Date(a.local_datetime).getTime() - new Date(b.local_datetime).getTime()
    );

    // Find the next available forecast
    const nextForecast = sortedTimes.find(time => 
      isBefore(currentTime, parseISO(time.local_datetime))
    );

    // If no next forecast found (we're after the last forecast), take the first forecast of next interval
    if (!nextForecast) {
      const firstTime = sortedTimes[0];
      // Add 3 hours to the first available time to get the next interval
      const nextIntervalTime = addHours(parseISO(firstTime.local_datetime), 3);
      return {
        ...firstTime,
        local_datetime: nextIntervalTime.toISOString()
      };
    }

    return nextForecast;
  };

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get<WeatherResponse>(
        'https://api.bmkg.go.id/publik/prakiraan-cuaca?adm1=18'
      );
      
      // Get 3 random regions
      const shuffled = [...response.data.data].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3).map(item => {
        const nextWeather = findNextWeatherData(item.cuaca[0], currentTime);
        
        return {
          region: item.lokasi.kotkab,
          weather: nextWeather.weather_desc,
          temperature: nextWeather.t,
          humidity: nextWeather.hu,
          time: nextWeather.local_datetime,
          imageUrl: nextWeather.image
        };
      });
      
      setWeatherData(selected);
      setCountdown(60); // Reset countdown
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  // Weather update effect - runs every minute
  useEffect(() => {
    fetchWeatherData();
    const weatherInterval = setInterval(fetchWeatherData, 60000);
    return () => clearInterval(weatherInterval);
  }, []); // Remove currentTime dependency

  // Time update effect - runs every second
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      setCountdown(prev => {
        if (prev <= 1) {
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timeInterval);
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 to-blue-900' 
        : 'bg-gradient-to-br from-blue-100 to-white'
    } py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDark ? 'bg-white/10 text-white' : 'bg-gray-200 text-gray-800'
            } hover:opacity-80 transition-opacity`}
          >
            {isDark ? <FiSun size={24} /> : <FiMoon size={24} />}
          </button>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl font-bold text-center mb-8 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          Lampung Weather Forecast
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-12"
        >
          <p className={isDark ? 'text-white' : 'text-gray-800'}>
            {format(currentTime, 'EEEE, MMMM d, yyyy HH:mm:ss')}
          </p>
          <p className={`mt-2 ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
            Next update in: {countdown} seconds
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {weatherData.map((data, index) => (
            <WeatherCard 
              key={data.region} 
              data={data} 
              index={index}
              isDark={isDark}
            />
          ))}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center space-y-4 ${
            isDark ? 'text-white/60' : 'text-gray-600'
          }`}
        >
          <div className="flex justify-center space-x-6">
            <a
              href="https://instagram.com/angga.x0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition-colors"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://github.com/angga0x"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-400 transition-colors"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://tiktok.com/@angga.xox"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              <FaTiktok size={24} />
            </a>
          </div>
          <p>Data Provided by BMKG</p>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;