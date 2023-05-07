import { Component, OnInit } from '@angular/core';
import quotes from '../assets/quotes/quotes.json';
import { fullWeatherResponse } from './home/weatherModels/fullWeatherResponse.model';
import { weatherCodes } from './home/weatherModels/weatherCodes';

interface Quote {
  quote: string,
  author: string
}

 @Component({
   selector: 'app-root',
   templateUrl: './app.component.html',
   styleUrls: ['./app.component.scss']
 })

export class AppComponent implements OnInit {
  quotes: Quote[] = quotes;
  displayedQuote: string = "";
  author: string = "";
  quoteCounter: number = 0;
  codes: weatherCodes = new weatherCodes();
  videoSource: string = "./assets/photos/vids/sun.mp4";
  currentWeatherCode: number = 0;
  temperature: string = "0";
  windSpeed: string = "0";
  condition: string = "";
  time: number = 0;
  latitude: number = 0;
  longitude: number = 0;
  hour: string = "";
  minutes: string = "";

  async ngOnInit() {
    if (navigator.geolocation)
    {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      });
    } else {
      console.log("Geolocation is not available for user");
    }
    this.checkCurrentWeather();
    this.changeQuote();

    await setInterval(() => this.display_ct(), 1000);
    await setInterval(() => this.changeQuote(), 60000);
    await setInterval(this.checkCurrentWeather.bind(this), 1200000);
  }

  changeQuote() {
    var newQuoteIndex = Math.floor(Math.random() * (this.quotes.length - 0 + 1) + 0);
    this.displayedQuote = this.quotes[newQuoteIndex].quote;
    this.author = this.quotes[newQuoteIndex].author;
    this.quoteCounter++;

    switch(this.quotes[newQuoteIndex].author) { 
      case "Alan Watts": { 
         var author = document.getElementById("authorBoxx");
         author!.style.backgroundImage = "url('./assets/photos/alanWatts.jpg')";
         break; 
      } 
      case "Terrance Mckenna":{ 
         var author = document.getElementById("authorBoxx");
         author!.style.backgroundImage = "url('./assets/photos/terranceMckenna.jpg')";
         break; 
      } 
      default: { 
         var author = document.getElementById("authorBoxx");
         author!.style.backgroundImage = "./assets/photos/alanWatts.jpg";
         break; 
      } 
   } 
  }

  async checkCurrentWeather() {
    await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + this.latitude + "&longitude=" + this.longitude + "&timezone=CST&current_weather=true&forecast_days=1")
      .then(res => res.json())
      .then(data => this.setBackgroundBasedOnWeatherCode(data));
  }

   setBackgroundBasedOnWeatherCode(weather: fullWeatherResponse) {
    if(weather.current_weather.weathercode == this.currentWeatherCode)
    {
      return;
    }

    this.currentWeatherCode = weather.current_weather.weathercode;

     if (this.codes.clearSky.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/sun.mp4";
     } else if (this.codes.drizzle.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/drizzle.mp4";
     } else if (this.codes.fog.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/fog.mp4";
     } else if (this.codes.freezingRain.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/freezingrain.mp4";
     } else if (this.codes.partlyCloudy.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/partlyCloudy.mp4";
     } else if (this.codes.rain.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/rain.mp4";
     } else if (this.codes.snow.includes(weather.current_weather.weathercode)) {
        this.videoSource = "./assets/photos/vids/snow.mp4";
     }

     this.setWeatherUnits(weather);
   }

   setWeatherUnits(weather: fullWeatherResponse) {
    this.temperature = this.roundedToFixed(weather.current_weather.temperature, 1);
    this.windSpeed = this.roundedToFixed(weather.current_weather.windspeed / 1.609344, 1);
    switch(weather.current_weather.weathercode) { 
      case 0: { 
         this.condition = "Clear Sky"
         break; 
      } 
      case 1: 
      case 2:
      case 3:{ 
         this.condition = "Partly Cloudy"
         break; 
      } 
      case 45:
      case 48:{ 
         this.condition = "Fog"
         break; 
      } 
      case 51:
      case 53:
      case 55:
      case 56:
      case 57:{ 
         this.condition = "Drizzle"
         break; 
      } 
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
      case 95:
      case 96:
      case 99:{ 
         this.condition = "Rain"
         break; 
      } 
      case 66:
      case 67:{ 
         this.condition = "Freezing Rain"
         break; 
      } 
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:{ 
         this.condition = "Rain"
         break; 
      }
      default: { 
         this.condition = "Unknown"
         break; 
      } 
   } 
   }

   display_ct() {
    var currentTime = new Date();
    this.hour = currentTime.getHours().toString().length == 2 ? currentTime.getHours().toString() : "0" + currentTime.getHours().toString()
    this.minutes = currentTime.getMinutes().toString().length == 2 ? currentTime.getMinutes().toString() : "0" + currentTime.getMinutes().toString();
   }

    roundedToFixed(input: number, digits: number){
      var rounder = Math.pow(10, digits);
      return (Math.round(input * rounder) / rounder).toFixed(digits).toString();
    }
}