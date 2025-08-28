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
        // MOCK DATA
        this.pendingSubmissions = [
          {
            id: '1',
            userId: 'u101',
            cityId: 'c001',
            cityName: 'Київ',
            latitude: 50.4501,
            longitude: 30.5234,
            spotType: 'Стріт',
            description: 'Скейт-спот біля набережної з кількома перилами та сходами. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur nunc sit amet tellus eleifend, eget placerat.tiam a pulvinar magna. Donec euismod ligula vel porta.. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur nunc sit amet tellus eleifend, eget placerat.tiam a pulvinar magna. Donec euismod ligula vel porta..Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur nunc sit amet tellus eleifend, eget placerat.tiam a pulvinar magna. Donec euismod ligula vel porta..',
            skillLevel: 'Intermediate',
            isCovered: false,
            lighting: true,
            submittedAt: new Date('2025-08-26T11:00:00'),
            accessibility: 'Вільний доступ',
            condition: 'Добрий стан',
            imagesUrls: ['https://picsum.photos/id/1011/400/300'],
            submissionStatus: 'Pending'
          },
          {
            id: '2',
            userId: 'u102',
            cityId: 'c002',
            cityName: 'Львів',
            latitude: 49.8397,
            longitude: 24.0297,
            spotType: 'Парк',
            description: 'Невеликий скейтпарк з рампами і рейлами.',
            skillLevel: 'Beginner',
            isCovered: false,
            lighting: false,
            submittedAt: new Date('2025-08-25T12:35:00'),
            accessibility: 'Відкрито вдень',
            condition: 'Задовільний стан',
            imagesUrls: ['https://picsum.photos/id/1015/400/300'],
            submissionStatus: 'Approved'
          },
          {
            id: '3',
            userId: 'u103',
            cityId: 'c003',
            cityName: 'Черкаси',
            latitude: 49.4444,
            longitude: 32.0598,
            spotType: 'Стріт',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur nunc sit amet tellus eleifend, eget placerat.tiam a pulvinar magna. Donec euismod ligula vel porta..',
            skillLevel: 'Advanced',
            isCovered: null,
            lighting: null,
            submittedAt: new Date('2025-08-17T17:03:00'),
            accessibility: 'Приватна територія',
            condition: 'Потребує ремонту',
            imagesUrls: ['https://picsum.photos/id/1025/400/300'],
            submissionStatus: 'Approved'
          },
          {
            id: '4',
            userId: 'u104',
            cityId: 'c004',
            cityName: 'Вінниця',
            latitude: 49.2331,
            longitude: 28.4682,
            spotType: 'Спот',
            description: 'Місце біля ринку, популярне серед райдерів.',
            skillLevel: null,
            isCovered: false,
            lighting: true,
            submittedAt: new Date('2025-08-13T10:56:00'),
            accessibility: 'Вільний доступ',
            condition: null,
            imagesUrls: ['https://picsum.photos/id/1035/400/300'],
            submissionStatus: 'Rejected',
            rejectionReason: 'Shit.'
          }
        ] as SubmissionResponse[];
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
