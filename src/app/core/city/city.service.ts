import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CityResponse } from './city.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  httpClient: HttpClient = inject(HttpClient);

  getMatchingCities(pattern: string) : Observable<CityResponse[]> {
    return this.httpClient.get<CityResponse[]>(`${environment.spotServiceUrl}/api/cities`, 
      { 
        params: {
          pattern: pattern
        }
      }
    );
  }
}
