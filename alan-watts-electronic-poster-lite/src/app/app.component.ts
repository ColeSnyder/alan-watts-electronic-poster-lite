import { Component, OnInit } from '@angular/core';
import quotes from '../assets/quotes/quotes.json';
import { fullWeatherResponse } from './home/weatherModels/fullWeatherResponse.model';
import { weatherCodes } from './home/weatherModels/weatherCodes';

interface Quote {
  quote: string
}

 @Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
 })

export class AppComponent implements OnInit {
  quotes: Quote[] = quotes;
  displayedQuote: string = quotes[0].quote;
  quoteCounter: number = 0;
  codes: weatherCodes = new weatherCodes();
  videoSource: string = "./assets/photos/vids/sun.mp4";

  async ngOnInit() {
    var weather = await this.getCurrentWeather();

    this.setBackgroundBasedOnWeatherCode(weather);

    while (true) {
      this.displayedQuote = await this.changeQuote(this.quoteCounter);
      this.quoteCounter++;
      await this.delay(120000);
    }
  }

  changeQuote(counter: number) {
    if (counter == quotes.length) {
      this.quoteCounter = 0;
    }
    return quotes[this.quoteCounter].quote;
  }

  delay(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  getCurrentWeather(): Promise<fullWeatherResponse> {
    return fetch('https://api.open-meteo.com/v1/forecast?latitude=43.9844&longitude=-91.8693&timezone=CST&current_weather=true')
      .then(res => res.json())
      .then(res => {
        return res as fullWeatherResponse
      })
  }

   setBackgroundBasedOnWeatherCode(weather: fullWeatherResponse) {
     if (this.codes.clearSky.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/sun.mp4";
     } else if (this.codes.drizzle.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/drizzle.mp4";
     } else if (this.codes.fog.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/fog.mp4";
     } else if (this.codes.freezingRain.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/freezingrain.mp4";
     } else if (this.codes.partlyCloudy.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/clouds.mp4";
     } else if (this.codes.rain.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/rain.mp4";
     } else if (this.codes.snow.includes(weather.current_weather.weathercode)) {
      this.videoSource = "./assets/photos/vids/snow.mp4";
     }
   }
}