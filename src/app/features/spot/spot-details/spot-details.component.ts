import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit } from '@angular/core';
import { SpotResponse } from '../../../core/spot/spot-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotService } from '../../../core/spot/spot.service';
import { DatePipe } from '@angular/common';
import { SpotBadgesComponent } from '../../../shared/components/spot-badges/spot-badges.component';
import { ClickableMapComponent } from '../../../shared/components/clickable-map/clickable-map.component';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-spot-details',
  imports: [DatePipe, SpotBadgesComponent, ClickableMapComponent],
  templateUrl: './spot-details.component.html',
  styleUrl: './spot-details.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpotDetailsComponent implements OnInit {
  spot?: SpotResponse;
  spotId?: string;
  route = inject(ActivatedRoute);
  router = inject(Router);
  spotService = inject(SpotService);

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.spot = navigation?.extras.state?.['spot'] ?? history.state['spot'];

    if (!this.spot) {
      this.spotId = this.route.snapshot.paramMap.get('id') ?? undefined;

      if (this.spotId) {
        this.spotService.getSpotById(this.spotId).subscribe({
          next: (spot) => {
            this.spot = spot;
            console.log(spot);
          },
          error: (err) => console.error(err),
        });
      } else {
        console.error('No spot ID provided!');
      }
    }
  }
}
