import { motion } from 'framer-motion';
import type { WeatherData } from '../types/weather';
import { format } from 'date-fns';

interface WeatherCardProps {
  data: WeatherData;
  index: number;
  isDark: boolean;
}

export default function WeatherCard({ data, index, isDark }: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className={`${
        isDark
          ? 'bg-gradient-to-br from-white/10 to-white/5'
          : 'bg-white'
      } backdrop-blur-lg rounded-xl p-6 shadow-xl transition-colors duration-300`}
    >
      <div className="flex flex-col items-center gap-4">
        <h2 className={`text-xl font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {data.region}
        </h2>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24"
        >
          <img src={data.imageUrl} alt={data.weather} className="w-full h-full" />
        </motion.div>
        <div className={`text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <p className="text-3xl font-bold mb-2">{data.temperature}°C</p>
          <p className="text-lg mb-2">{data.weather}</p>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Humidity: {data.humidity}%
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {format(new Date(data.time), 'HH:mm')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}