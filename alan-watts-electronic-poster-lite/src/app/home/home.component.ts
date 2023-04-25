import { Component, OnInit } from '@angular/core';
import quotes from '../../assets/quotes/quotes.json';
import { fullWeatherResponse } from './weatherModels/fullWeatherResponse.model';
import { weatherCodes } from './weatherModels/weatherCodes';

interface Quote {
  quote: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {
  quotes: Quote[] = quotes;
  displayedQuote: string = quotes[0].quote;
  quoteCounter: number = 0;
  codes: weatherCodes = new weatherCodes();

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
     var elements = document.getElementsByClassName("wholeContainer");

     if (this.codes.clearSky.includes(weather.current_weather.weathercode)) {
       elements[0].classList.add("sunBackground");
     } else if (this.codes.drizzle.includes(weather.current_weather.weathercode)) {
       elements[0].classList.add("drizzleBackground");
     } else if (this.codes.fog.includes(weather.current_weather.weathercode)) {
       elements[0].classList.add("fogBackground");
     } else if (this.codes.freezingRain.includes(weather.current_weather.weathercode)) {
       elements[0].classList.add("freezingrainBackground");
     } else if (this.codes.partlyCloudy.includes(weather.current_weather.weathercode)) {
       elements[0].classList.add("partlyCloudyBackground");
     } else if (this.codes.rain.includes(weather.current_weather.weathercode)) {
       elements[0].classList.add("rainBackground");
     } else if (this.codes.snow.includes(weather.current_weather.weathercode)) {
       elements[0].classList.add("snowBackground");
     }
   }
}
