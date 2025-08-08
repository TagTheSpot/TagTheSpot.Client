import { Component, inject, Input, OnInit } from '@angular/core';
import { SpotResponse } from '../../../core/spot/spot.model';
import { ActivatedRoute } from '@angular/router';
import { SpotService } from '../../../core/spot/spot.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-spot-details',
  imports: [DatePipe],
  templateUrl: './spot-details.component.html',
  styleUrl: './spot-details.component.scss'
})
export class SpotDetailsComponent implements OnInit {
  @Input() spot?: SpotResponse;
  spotId?: string;
  route: ActivatedRoute = inject(ActivatedRoute);
  spotService: SpotService = inject(SpotService);

  ngOnInit(): void {
    if (!this.spot) {
      this.spotId = this.route.snapshot.paramMap.get('id') ?? undefined;

      if (this.spotId) {
        this.spotService.getSpotById(this.spotId).subscribe({
          next: (spot) => (this.spot = spot),
          error: (err) => console.error(err),
        });
      } else {
        console.error('No spot ID provided!');
      }
    }
  }
}
