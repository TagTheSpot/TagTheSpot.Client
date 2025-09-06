import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SubmissionResponse } from './submission-response.model';
import { RejectSubmissionRequest } from './reject-submission-request.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  httpClient = inject(HttpClient);
  private moderationBaseUrl = environment.moderationServiceUrl;
  private spotBaseUrl = environment.spotServiceUrl;
  
  getSubmissionById(submissionId: string) : Observable<SubmissionResponse> {
    return this.httpClient.get<SubmissionResponse>(`${this.spotBaseUrl}/api/submissions/${submissionId}`);
  }

  getPendingSubmissions() : Observable<SubmissionResponse[]> {
    return this.httpClient.get<SubmissionResponse[]>(`${this.moderationBaseUrl}/api/submissions/pending`);
  }

  getCurrentUserSubmissions() : Observable<SubmissionResponse[]> {
    return this.httpClient.get<SubmissionResponse[]>(`${this.spotBaseUrl}/api/submissions/mine`)
      .pipe(
        map(submissions => submissions
          .map(sub => ({ ...sub, submittedAt: new Date(sub.submittedAt) }))
          .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
        )
      );
  }

  rejectSubmission(request: RejectSubmissionRequest) : Observable<any> {
    return this.httpClient.patch<any>(`${this.moderationBaseUrl}/api/submissions/reject`, request);
  }

  approveSubmission(submissionId: string) : Observable<any> {
    return this.httpClient.patch<any>(`${this.moderationBaseUrl}/api/submissions/approve`, 
      JSON.stringify(submissionId),
      { headers: { 'Content-Type': 'application/json' } });
  }
}
