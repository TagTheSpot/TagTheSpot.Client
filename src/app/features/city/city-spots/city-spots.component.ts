import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpotResponse } from '../../../core/spot/spot-response.model';
import { SpotService } from '../../../core/spot/spot.service';

@Component({
  selector: 'app-city-spots',
  imports: [RouterModule],
  templateUrl: './city-spots.component.html',
  styleUrl: './city-spots.component.scss'
})
export class CitySpotsComponent implements OnInit {
  cityName: string = '';
  cityId: string = '';
  spots: SpotResponse[] = [];
  spotService: SpotService = inject(SpotService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute)

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (!id) {
        console.error('No city ID in route');
        return;
      }

      this.cityId = id;

      this.route.queryParamMap.subscribe(queryParams => {
        const cityName = queryParams.get('cityName');

        if (cityName) {
          this.cityName = cityName;
        }
      });

      const reload = history.state['reload'] ?? false;

      if (reload || this.spots.length === 0) {
        this.spotService.getSpotsByCityId(this.cityId).subscribe({
          next: (spots) => this.spots = spots,
          error: (err) => console.error(err)
        });
      }
    });
  }

  navigateToSpotDetails(spot: SpotResponse) {
    this.router.navigate(['/spots', spot.id], { state: { spot } });
  }

  navigateToAddNewSpot() {
    this.router.navigate([`/cities/${this.cityId}/spots/add`], {
      queryParams: { cityName: this.cityName }
    });
  }
}
