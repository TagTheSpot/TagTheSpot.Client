import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SpotResponse } from '../../../core/spot/spot-response.model';
import { SpotService } from '../../../core/spot/spot.service';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/auth/auth.service';

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
  toastService: ToastService = inject(ToastService);
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  showConfirm = false;
  loading = false;

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
        this.loadSpots();
      }
    });
  }

  navigateToSpotDetails(spot: SpotResponse) {
    this.router.navigate(['/spots', spot.id], { state: { spot } });
  }

  navigateToAddNewSpot() {
    this.router.navigate([`/cities/${this.cityId}/spots/add`]);
  }

  selectedSpot: SpotResponse | null = null;

  openConfirm(spot: SpotResponse) {
    this.selectedSpot = spot;
    this.showConfirm = true;
  }

  closeConfirm() {
    this.showConfirm = false;
    this.selectedSpot = null;
  }

  confirmDelete() {
    const id = this.selectedSpot?.id;

    if (!id) {
      return;
    }

    this.loading = true;
    // optimistic remove so UI feels instant
    const prev = this.spots;
    this.spots = this.spots.filter(s => s.id !== id);

    this.spotService.deleteSpot(id).subscribe({
      next: () => {
        this.loadSpots();
        this.closeConfirm();
        this.toastService.show('✅ Спот успішно видалено!')
      },
      error: err => {
        console.error(err);
        this.spots = prev;
        this.loading = false;
        alert('Не вдалося видалити спот по невідомій причині.');
      }
    });
  }

  private loadSpots() {
    this.loading = true;
    this.spotService.getSpotsByCityId(this.cityId).subscribe({
      next: spots => {
        this.spots = spots;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
