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

  ngOnInit(): void {
    this.submissionService.getCurrentUserSubmissions().subscribe({
      next: (submissions) => {
        this.submissions = submissions;
        
        // MOCK DATA
        this.submissions = [
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
      error: (error) => {
        console.log(error);
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
