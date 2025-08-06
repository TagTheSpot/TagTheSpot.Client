import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CityResponse } from './city.model';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  httpClient: HttpClient = inject(HttpClient);

  getMatchingCities(pattern: string) : Observable<CityResponse[]> {
    return this.httpClient.get<CityResponse[]>('https://localhost:18002/api/cities', 
      { 
        params: {
          pattern: pattern
        }
      }
    );
  }
}
