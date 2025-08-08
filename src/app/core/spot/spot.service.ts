import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotResponse } from './spot.model';

@Injectable({
  providedIn: 'root'
})
export class SpotService {
  httpClient: HttpClient = inject(HttpClient);

  getSpotsByCityId(cityId: string) : Observable<SpotResponse[]> {
    return this.httpClient.get<SpotResponse[]>(`https://localhost:18002/api/cities/${cityId}/spots`);
  }

  getSpotById(spotId: string) : Observable<SpotResponse> {
    return this.httpClient.get<SpotResponse>(`https://localhost:18002/api/spots/${spotId}`);
  }
}
