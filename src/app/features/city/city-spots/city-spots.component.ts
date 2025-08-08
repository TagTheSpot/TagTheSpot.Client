import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotResponse } from '../../../core/spot/spot.model';
import { SpotService } from '../../../core/spot/spot.service';

@Component({
  selector: 'app-city-spots',
  imports: [],
  templateUrl: './city-spots.component.html',
  styleUrl: './city-spots.component.scss'
})
export class CitySpotsComponent implements OnInit {
  cityId: string = '';
  spots: SpotResponse[] = [];
  spotService: SpotService = inject(SpotService);
  router: Router = inject(Router);

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        console.error('No city ID in route');
        return;
      }

      this.cityId = id;

      this.spotService.getSpotsByCityId(this.cityId).subscribe({
        next: (spots) => this.spots = spots,
        error: (err) => console.error(err)
      });
    });
  }

  navigateToSpotDetails(spot: SpotResponse) {
    this.router.navigate(['/spots', spot.id], { state: { spot } });
  }
}
