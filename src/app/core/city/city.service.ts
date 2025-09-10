import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CityResponse } from './city.model';
import { environment } from '../../../environments/environment';
import { CitySpotsCoordinatesResponse } from './city-spots-coordinates.model';

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

  getCitySpotsCoordinatesByCityId(cityId: string) : Observable<CitySpotsCoordinatesResponse> {
    return this.httpClient.get<CitySpotsCoordinatesResponse>(
      `${environment.spotServiceUrl}/api/cities/${cityId}/spots/coordinates`);
  }
}
