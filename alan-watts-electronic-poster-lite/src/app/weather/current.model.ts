import { currentWeather } from "./currentWeather.model";

export interface current {
    dt: number,
    sunrise: number,
    sunset: number,
    temp: any,
    feelsLike: any,
    pressure: number,
    humidity: number,
    uvi: any,
    visibility: number,
    windSpeed: number,
    weather: currentWeather,
  }
  