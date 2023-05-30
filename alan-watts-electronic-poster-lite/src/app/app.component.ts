import { Component, OnInit } from '@angular/core';
import quotes from '../assets/quotes/quotes.json';
import { weatherCodes } from './weather/weatherCodes';

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

        this.checkCurrentWeather();

        setInterval(() => this.checkCurrentWeather(), 1200000);
      });

    } else {
      console.log("Geolocation is not available for user");
    }

    this.changeQuote();

    setInterval(() => this.display_time(), 1000);
    setInterval(() => this.changeQuote(), 60000);
  }

  changeQuote() {
    var newQuoteIndex = Math.floor((Math.random() * this.quotes.length));
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

  checkCurrentWeather() {
      fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + this.latitude + "&lon=" + this.longitude + "&units=imperial&appid=c5c5544ec740f0c9a05f7e006a5381ff")
      .then(res => res.json())
      .then(data => this.setBackgroundBasedOnWeatherCode(data));
   }

  setBackgroundBasedOnWeatherCode(weather: any) {
    this.setWeatherUnits(weather);

    if(weather.weather[0].id == this.currentWeatherCode)
    {
      return;
    }
    
    this.currentWeatherCode = weather.weather[0].id;

     if (this.codes.clearSky.includes(weather.weather[0].id)) {
        this.videoSource = "./assets/photos/vids/sun.mp4";
     } else if (this.codes.drizzle.includes(weather.weather[0].id)) {
        this.videoSource = "./assets/photos/vids/drizzle.mp4";
     } else if (this.codes.fog.includes(weather.weather[0].id)) {
        this.videoSource = "./assets/photos/vids/fog.mp4";
     } else if (this.codes.freezingRain.includes(weather.weather[0].id)) {
        this.videoSource = "./assets/photos/vids/freezingrain.mp4";
     } else if (this.codes.partlyCloudy.includes(weather.weather[0].id)) {
        this.videoSource = "./assets/photos/vids/partlyCloudy.mp4";
     } else if (this.codes.rain.includes(weather.weather[0].id)) {
        this.videoSource = "./assets/photos/vids/rain.mp4";
     } else if (this.codes.snow.includes(weather.weather[0].id)) {
        this.videoSource = "./assets/photos/vids/snow.mp4";
     }
  }

  setWeatherUnits(weather: any) {
    this.temperature = this.roundedToFixed(weather.main.temp, 1);
    this.windSpeed = weather.wind.speed;
    switch(weather.weather[0].id) { 
      case 800: { 
         this.condition = "Clear Sky"
         break; 
      } 
      case 801: 
      case 802:
      case 803:
      case 804:{ 
         this.condition = "Partly Cloudy"
         break; 
      } 
      case 741:
      case 701:{ 
         this.condition = "Fog"
         break; 
      } 
      case 300:
      case 301:
      case 302:
      case 310:
      case 311:
      case 312:
      case 313:
      case 314:
      case 321:{ 
         this.condition = "Drizzle"
         break; 
      } 
      case 200:
      case 201:
      case 202:
      case 210:
      case 211:
      case 212:
      case 221:
      case 230:
      case 231:
      case 232:
      case 500:
      case 501:
      case 502:
      case 503:
      case 504:
      case 520:
      case 521:
      case 522:
      case 531:{ 
         this.condition = "Rain"
         break; 
      } 
      case 511:{ 
         this.condition = "Freezing Rain"
         break; 
      } 
      case 600:
      case 601:
      case 602:
      case 611:
      case 612:
      case 613:
      case 615:
      case 616:
      case 620:
      case 621:
      case 622:{ 
         this.condition = "snow"
         break; 
      }
      default: { 
         this.condition = "Unknown"
         break; 
      } 
   } 
  }

  display_time() {
    var currentTime = new Date();
    this.hour = currentTime.getHours().toString().length == 2 ? currentTime.getHours().toString() : "0" + currentTime.getHours().toString()
    this.minutes = currentTime.getMinutes().toString().length == 2 ? currentTime.getMinutes().toString() : "0" + currentTime.getMinutes().toString();
  }

  roundedToFixed(input: number, digits: number){
      var rounder = Math.pow(10, digits);
      return (Math.round(input * rounder) / rounder).toFixed(digits).toString();
  }
}