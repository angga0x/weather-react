export interface WeatherResponse {
  lokasi: {
    adm1: string;
    provinsi: string;
    lon: number;
    lat: number;
    timezone: string;
  };
  data: {
    lokasi: {
      adm1: string;
      adm2: string;
      provinsi: string;
      kotkab: string;
      lon: number;
      lat: number;
      timezone: string;
      type: string;
    };
    cuaca: Array<{
      datetime: string;
      t: number;
      weather: number;
      weather_desc: string;
      weather_desc_en: string;
      hu: number;
      image: string;
      local_datetime: string;
    }>[];
  }[];
}

export interface WeatherData {
  region: string;
  weather: string;
  temperature: number;
  humidity: number;
  time: string;
  imageUrl: string;
}