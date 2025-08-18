import { Component, inject, OnInit } from '@angular/core';
import { SubmissionService } from '../../../core/submission/submission.service';
import { SubmissionResponse } from '../../../core/submission/submission-response.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-submissions',
  imports: [DatePipe],
  templateUrl: './my-submissions.component.html',
  styleUrl: './my-submissions.component.scss'
})
export class MySubmissionsComponent implements OnInit {
  submissionService = inject(SubmissionService);
  submissions: SubmissionResponse[] | null = null;

  ngOnInit(): void {
    this.submissionService.getCurrentUserSubmissions().subscribe({
      next: (submissions) => {
        this.submissions = submissions;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
