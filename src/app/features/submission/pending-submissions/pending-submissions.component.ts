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
  loading = false;

  ngOnInit(): void {
    this.loading = true;
    this.submissionService.getPendingSubmissions().subscribe({
      next: (submissions) => {
        this.pendingSubmissions = submissions;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        
        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
        }
        else {
          console.log(`Unknown error: ${err}`);
        }
      }
    });
  }

  navigateToSubmissionDetails(submissionId: string) {
    this.router.navigate(['/submissions', submissionId], {
      state: { submission: this.pendingSubmissions?.filter(sub => sub.id == submissionId)[0] }
    });
  }
}

