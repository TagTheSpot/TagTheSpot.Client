export interface SubmissionResponse {
    id: string,
    userId: string,
    cityId: string,
    cityName: string,
    latitude: number,
    longitude: number,
    spotType: string,
    description: string,
    skillLevel: string | null,
    isCovered: boolean | null,
    lighting: boolean | null,
    submittedAt: Date,
    accessibility: string | null,
    condition: string | null,
    imagesUrls: string[]
}