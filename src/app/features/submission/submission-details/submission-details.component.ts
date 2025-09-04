import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { SubmissionResponse } from '../../../core/submission/submission-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmissionService } from '../../../core/submission/submission.service';
import { DatePipe } from '@angular/common';
import { SpotBadgesComponent } from '../../../shared/components/spot-badges/spot-badges.component';
import { ClickableMapComponent } from '../../../shared/components/clickable-map/clickable-map.component';
import { register } from 'swiper/element/bundle';
import { AuthService } from '../../../core/auth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RejectSubmissionRequest } from '../../../core/submission/reject-submission-request.model';
import { ToastService } from '../../../shared/services/toast.service';

register();

@Component({
  selector: 'app-submission-details',
  imports: [DatePipe, SpotBadgesComponent, ClickableMapComponent, ReactiveFormsModule],
  templateUrl: './submission-details.component.html',
  styleUrl: './submission-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubmissionDetailsComponent {
  fb = inject(FormBuilder);
  submission?: SubmissionResponse;
  submissionId: string = '';
  route = inject(ActivatedRoute);
  router = inject(Router);
  submissionService = inject(SubmissionService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  isRejecting = false;
  errorMessage: string = '';
  form!: FormGroup;

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.submission = navigation?.extras.state?.['submission'] ?? history.state['submission'];

    if (!this.submission) {
      this.submissionId = this.route.snapshot.paramMap.get('id') ?? '';

      if (this.submissionId) {
        this.submissionService.getSubmissionById(this.submissionId).subscribe({
          next: (submission) => {
            this.submission = submission;
          },
          error: (err) => console.error(err),
        });
      } else {
        console.error('No spot ID provided!');
      }
    } else {
      this.submissionId = this.submission.id;
    }

    this.form = this.fb.group({
      submissionId: [this.submissionId],
      rejectionReason: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
  }

  toggleRejecting() {
    this.errorMessage = '';
    this.isRejecting = !this.isRejecting;
  }

  approveSubmission() {
    this.errorMessage = '';
    this.submissionService.approveSubmission(this.submissionId).subscribe({
      next: () => {
        this.toastService.show('✅ Заявку успішно підтверджено!');
        this.router.navigate(['/submissions', 'pending']);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Будь ласка, спробуйте пізніше.';
      }
    });
  }

  submitRejection() {
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    } 

    const request: RejectSubmissionRequest = {
      ...this.form.value
    };

    this.submissionService.rejectSubmission(request).subscribe({
      next: () => {
        this.isRejecting = false;
        this.toastService.show('✅ Заявку успішно відхилено!');
        this.router.navigate(['/submissions', 'pending']);
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = 'Будь ласка, спробуйте пізніше.';
      }
    });
  }
}
