import { Component, inject, OnInit } from '@angular/core';
import { CityService } from '../../core/city/city.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CityResponse } from '../../core/city/city.model';
import { debounceTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SpotService } from '../../core/spot/spot.service';

@Component({
  selector: 'app-main',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent implements OnInit {
  cityService = inject(CityService);
  spotService = inject(SpotService);
  router = inject(Router);
  searchControl = new FormControl('');
  suggestions: CityResponse[] = [];

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300))
      .subscribe(query => {
        if (!query || typeof query !== 'string') {
          this.suggestions = [];
          return;
        }

        this.cityService.getMatchingCities(query).subscribe({
          next: cities => {
            this.suggestions = cities;
          },
          error: () => {
            this.suggestions = [];
          }
        });
      });
  }

  selectCity(city: CityResponse): void {
    this.router.navigate(['/cities', city.id, 'spots']);
  }
}
