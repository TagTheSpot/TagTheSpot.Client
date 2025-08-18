import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubmissionResponse } from './submission-response.model';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {
  httpClient = inject(HttpClient);

  getPendingSubmissions() : Observable<SubmissionResponse[]> {
    return this.httpClient.get<SubmissionResponse[]>('https://localhost:18003/api/submissions/pending');
  }

  getCurrentUserSubmissions() : Observable<SubmissionResponse[]> {
    return this.httpClient.get<SubmissionResponse[]>('https://localhost:18003/api/submissions/mine');
  }
}
