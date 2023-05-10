import { current } from "./current.model";
import { hourly } from "./hourly.model";

export interface fullWeatherResponse {
  latitude: any,
  longitude: any,
  current: current,
  hourly: hourly
}
