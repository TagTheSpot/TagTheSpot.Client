import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  httpClient: HttpClient = inject(HttpClient);

  getMatchingCities(pattern: string) {
    return this.httpClient.get('https://localhost:18002', 
      { 
        params: {
          pattern: pattern
        }
      }
    );
  }
}
