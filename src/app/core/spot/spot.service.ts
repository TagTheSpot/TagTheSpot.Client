import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpotResponse } from './spot-response.model';
import { SpotRequest } from './spot-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpotService {
  httpClient: HttpClient = inject(HttpClient);
  private baseUrl = environment.spotServiceUrl;

  getSpotsByCityId(cityId: string) : Observable<SpotResponse[]> {
    return this.httpClient.get<SpotResponse[]>(`${this.baseUrl}/api/cities/${cityId}/spots`);
  }

  getSpotById(spotId: string) : Observable<SpotResponse> {
    return this.httpClient.get<SpotResponse>(`${this.baseUrl}/api/spots/${spotId}`);
  }

  getRandomSpotsByCityId(cityId: string, count: number) : Observable<SpotResponse[]> {
    return this.httpClient.get<SpotResponse[]>(`${this.baseUrl}/api/spots/random`,
      {
        params: {
          cityId: cityId,
          count: count
        }
      }
    );
  }

  addSpot(request: SpotRequest) : Observable<string> {
    const formData = this.buildSpotRequestObject(request);

    return this.httpClient.post<string>(`${this.baseUrl}/api/spots`, formData);
  }

  submitSpot(request: SpotRequest) : Observable<string> {
    const formData = this.buildSpotRequestObject(request);

    return this.httpClient.post<string>(`${this.baseUrl}/api/spots/submit`, formData);
  }

  deleteSpot(spotId: string) : Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/api/spots`, 
      { 
        params: {
          id: spotId
        }
      }
    );
  }

  private buildSpotRequestObject(request: SpotRequest) : FormData {
    const formData = new FormData();

    formData.append('cityId', request.cityId);
    formData.append('latitude', request.latitude.toString());
    formData.append('longitude', request.longitude.toString());
    formData.append('spotType', request.type.toString());
    formData.append('description', request.description.toString());

    if (request.isCovered !== undefined && request.isCovered !== null) {
      formData.append('isCovered', request.isCovered.toString());
    }

    if (request.lighting !== undefined && request.lighting !== null) {
      formData.append('lighting', request.lighting.toString());
    }

    if (request.accessibility !== undefined && request.accessibility !== null) {
      formData.append('accessibility', request.accessibility.toString());
    }

    if (request.condition !== undefined && request.condition !== null) {
      formData.append('condition', request.condition.toString());
    }

    if (request.skillLevel !== undefined && request.skillLevel !== null) {
      formData.append('skillLevel', request.skillLevel.toString());
    }

    request.images.forEach((file) => {
      formData.append('images', file, file.name); 
    });

    return formData;
  }
}
