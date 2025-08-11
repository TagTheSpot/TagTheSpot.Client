export interface SpotRequest {
    cityId: string,
    latitude: number,
    longitude: number,
    type: string,
    description: string,
    skillLevel: string | null,
    isCovered: boolean | null,
    lighting: boolean | null,
    createdAt: Date,
    accessibility: string | null,
    condition: string | null,
    images: File[]
}