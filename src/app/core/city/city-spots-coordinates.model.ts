import { CityResponse } from "./city.model";
import { CoordinatesResponse } from "./coordinates.model";

export interface CitySpotsCoordinatesResponse {
    city: CityResponse,
    spotsCoordinates: CoordinatesResponse[]
}