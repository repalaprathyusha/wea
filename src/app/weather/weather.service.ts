import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Weather } from '../shared/interfaces/weather';
import { WeatherData } from '../shared/interfaces/weather-data';

@Injectable({
 providedIn: 'root'
})
export class WeatherService {
  private URL = 'http://api.openweathermap.org/data/2.5/weather?q=';
  private KEY = 'e03342666561f56b39dacf9f4a7f8f2b';
  private IMP = '&units=imperial';

 constructor(private http: HttpClient) { }

 searchWeatherData(cityName: string): Observable<Weather> {
   return this
            .http
            .get<WeatherData>(`${this.URL}${cityName}&APPID=${this.KEY}${this.IMP}`)
            .pipe(
              map(data => this.transformWeatherData(data)),
              tap(data => console.log(JSON.stringify(data))),
              catchError(this.handleError)
            );
 }

 private transformWeatherData(data: WeatherData): Weather {
   return {
    name: data.name,
    country: data.sys.country,
    image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
    description: data.weather[0].description,
    temperature: data.main.temp,
    lat: data.coord.lat,
    lon: data.coord.lon
   };
 }

 private handleError(res: HttpErrorResponse) {
  console.error(res);
  return throwError(res.error || 'Server error');
 }
}
