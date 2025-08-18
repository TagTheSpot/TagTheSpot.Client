import { Component, inject, OnInit } from '@angular/core';
import { SubmissionService } from '../../../core/submission/submission.service';
import { SubmissionResponse } from '../../../core/submission/submission-response.model';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pending-submissions',
  imports: [DatePipe],
  templateUrl: './pending-submissions.component.html',
  styleUrl: './pending-submissions.component.scss'
})
export class PendingSubmissionsComponent implements OnInit {
  submissionService = inject(SubmissionService);
  pendingSubmissions: SubmissionResponse[] | null = null;
  router = inject(Router);

  ngOnInit(): void {
    this.submissionService.getPendingSubmissions().subscribe({
      next: (submissions) => {
        this.pendingSubmissions = submissions;
        console.log('Retrieved pending submissions successfully.');
      },
      error: (err) => {
        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
        }
        else {
          console.log(`Unknown error: ${err}`);
        }
      }
    });
  }
}
