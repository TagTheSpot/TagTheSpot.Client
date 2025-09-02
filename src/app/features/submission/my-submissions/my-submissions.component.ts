import { Component, inject, OnInit } from '@angular/core';
import { SubmissionService } from '../../../core/submission/submission.service';
import { SubmissionResponse } from '../../../core/submission/submission-response.model';
import { DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-submissions',
  imports: [DatePipe, RouterModule],
  templateUrl: './my-submissions.component.html',
  styleUrl: './my-submissions.component.scss'
})
export class MySubmissionsComponent implements OnInit {
  submissionService = inject(SubmissionService);
  router = inject(Router);
  submissions: SubmissionResponse[] | null = null;
  loading = false;

  ngOnInit(): void {
    const reload = history.state['reload'] ?? false;

    if (reload || !this.submissions || this.submissions.length === 0) {
      this.loadSubmissions();
    }
  }

  loadSubmissions() {
    this.loading = true;

    this.submissionService.getCurrentUserSubmissions().subscribe({
      next: (submissions) => {
        this.submissions = submissions;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    })
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear();
  }

  isYesterday(date: Date): boolean {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    return date.getDate() === yesterday.getDate() &&
          date.getMonth() === yesterday.getMonth() &&
          date.getFullYear() === yesterday.getFullYear();
  }

  daysAgo(date: Date): number {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffMs = startOfToday.getTime() - startOfDate.getTime();
    return diffMs / (1000 * 60 * 60 * 24);
  }

  pluralizeDays(n: number): string {
    if (n === 1) return '1 день тому';
    const lastDigit = n % 10;
    const lastTwo = n % 100;

    if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) {
      return `${n} дні тому`;
    }
    return `${n} днів тому`;
  }

  navigateToSubmissionDetails(submissionId: string) {
    //TO DO
    this.router.navigate(['/']);
  }
}
