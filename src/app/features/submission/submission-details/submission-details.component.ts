import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { SubmissionResponse } from '../../../core/submission/submission-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SubmissionService } from '../../../core/submission/submission.service';
import { DatePipe } from '@angular/common';
import { SpotBadgesComponent } from '../../../shared/components/spot-badges/spot-badges.component';
import { ClickableMapComponent } from '../../../shared/components/clickable-map/clickable-map.component';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-submission-details',
  imports: [DatePipe, SpotBadgesComponent, ClickableMapComponent],
  templateUrl: './submission-details.component.html',
  styleUrl: './submission-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SubmissionDetailsComponent {
  submission?: SubmissionResponse;
  submissionId?: string;
  route = inject(ActivatedRoute);
  router = inject(Router);
  submissionService = inject(SubmissionService);

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.submission = navigation?.extras.state?.['submission'] ?? history.state['submission'];

    if (!this.submission) {
      this.submissionId = this.route.snapshot.paramMap.get('id') ?? undefined;

      if (this.submissionId) {
        this.submissionService.getSubmissionById(this.submissionId).subscribe({
          next: (submission) => {
            this.submission = submission;
          },
          error: (err) => console.error(err),
        });
        //MOCK DATA
        this.submission = {
          id: 'sub-123',
          userId: 'user-456',
          cityId: 'city-789',
          cityName: 'Kyiv',
          latitude: 50.4501,
          longitude: 30.5234,
          spotType: 'Park',
          description: 'A great spot for skating with ramps and rails.',
          skillLevel: 'Intermediate',
          isCovered: false,
          lighting: true,
          submittedAt: new Date('2024-09-01T10:30:00Z'),
          accessibility: 'Public',
          condition: 'Good',
          imagesUrls: [
            'https://example.com/image1.jpg',
            'https://example.com/image2.jpg'
          ],
          submissionStatus: 'Rejected',
          rejectionReason: 'Спот прикольний, але хуйня внатурі.'
        };
      } else {
        console.error('No spot ID provided!');
      }
    }
  }
}
