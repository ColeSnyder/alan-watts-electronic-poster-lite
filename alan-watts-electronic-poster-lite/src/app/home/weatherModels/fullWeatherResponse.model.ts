import { current } from './current.model';
import { hourly } from './hourly.model';
import { hourlyUnits } from './hourlyUnits.model';
 
export interface fullWeatherResponse {
  latitude: any,
  longitude: any,
  elevation: any,
  generationtime_ms: any,
  utc_offset_seconds: any,
  timezone: string,
  timezone_abbreviation: string,
  hourly: hourly,
  hourlyUnits: hourlyUnits,
  current_weather: current
}
