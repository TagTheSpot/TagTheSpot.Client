import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubmissionResponse } from './submission-response.model';
import { RejectSubmissionRequest } from './reject-submission-request.model';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  httpClient = inject(HttpClient);
  
  getSubmissionById(submissionId: string) : Observable<SubmissionResponse> {
    return this.httpClient.get<SubmissionResponse>(`https://localhost:18002/api/submissions/${submissionId}`);
  }

  getPendingSubmissions() : Observable<SubmissionResponse[]> {
    return this.httpClient.get<SubmissionResponse[]>('https://localhost:18003/api/submissions/pending');
  }

  getCurrentUserSubmissions() : Observable<SubmissionResponse[]> {
    return this.httpClient.get<SubmissionResponse[]>('https://localhost:18002/api/submissions/mine');
  }

  rejectSubmission(request: RejectSubmissionRequest) : Observable<any> {
    return this.httpClient.patch<any>('https://localhost:18003/api/submissions/reject', request);
  }

  approveSubmission(submissionId: string) : Observable<any> {
    return this.httpClient.patch<any>('https://localhost:18003/api/submissions/approve', submissionId);
  }
}
