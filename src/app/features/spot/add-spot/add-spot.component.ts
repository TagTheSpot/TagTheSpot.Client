import { Component, inject, OnInit } from '@angular/core';
import { SpotRequest } from '../../../core/spot/spot-request.model';
import { SpotService } from '../../../core/spot/spot.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClickableMapComponent } from '../../../shared/components/clickable-map/clickable-map.component';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CityService } from '../../../core/city/city.service';
import { CityResponse } from '../../../core/city/city.model';

@Component({
  selector: 'app-add-spot',
  imports: [RouterModule, ReactiveFormsModule, ClickableMapComponent],
  templateUrl: './add-spot.component.html',
  styleUrl: './add-spot.component.scss'
})
export class AddSpotComponent implements OnInit {
  fb = inject(FormBuilder);
  spotService = inject(SpotService);
  cityService = inject(CityService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorMessage: string = '';
  cityId: string = '';
  cityData: CityResponse | null = null;
  spotsMarkers: { lat: number; lon: number }[] = [];
  mapCenter?: { lat: number; lon: number };
  userMarkerPosition?: { lat: number; lon: number };
  mapZoom: number = 13;

  form!: FormGroup;
  imageErrors: string[] = [];
  files: File[] = [];

  ngOnInit(): void {
    this.cityId = this.route.snapshot.paramMap.get('id') ?? '';

    this.form = this.fb.group({
      cityId: [this.cityId],
      latitude: [null],
      longitude: [null],
      type: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      isCovered: [null],
      lighting: [null],
      skillLevel: [null],
      accessibility: [null],
      condition: [null]
    });

    this.cityService.getCitySpotsCoordinatesByCityId(this.cityId).subscribe({
      next: (res) => {
        this.cityData = res.city;
        this.mapCenter = { lat: res.city.latitude, lon: res.city.longitude };
        this.spotsMarkers = res.spotsCoordinates?.map(c => ({ lat: c.latitude, lon: c.longitude })) ?? [];
      },
      error: (err) => {
        console.log(err);
        console.log('Unknown error happened during sending a request to the API.');
      }
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    let invalid = false;

    if (!this.files || this.files.length === 0) {
      this.imageErrors = ['Завантажте хоча б один файл.'];
      invalid = true;
    }

    if (!this.form.get('latitude')?.value || !this.form.get('longitude')?.value){
      this.errorMessage = 'Будь ласка, оберіть точку на мапі.';
      invalid = true;
    }

    if (this.form.invalid || invalid) {
      return;
    } 

    const spotRequest: SpotRequest = {
      ...this.form.value,
      images: this.files
    };

    const isRegularUser = this.authService.isRegularUser();

    if (isRegularUser) {
      this.spotService.submitSpot(spotRequest).subscribe({
        next: () => {
          this.toastService.show('✅ Заявку успішно додано!');
          this.router.navigate(['/submissions'], {
            state: { reload: true }
          });
        },
        error: (err) => {
          if (err.error.detail == 'The description contains unsafe content.') {
            this.errorMessage = "Опис містить небезпечний вміст. Будь ласка, змініть його та спробуйте ще раз.";
          }
          else if (err.error.detail == 'The coordinates of the location are outside of the requested city.') {
            this.errorMessage = "Спот розташований поза межами обраного міста.";
          }
          else if (err.error.detail == 'The coordinates of the location are too close to another existing spot/submission.') {
            this.errorMessage = "Спот розташований занадто близько до іншого існуючого споту або заявки.";
          }
          else {
            this.errorMessage = "Будь ласка, спробуйте пізніше.";
          }
        }
      });
    } else {
      this.spotService.addSpot(spotRequest).subscribe({
        next: () => {
          this.toastService.show('✅ Спот успішно додано!');
          this.router.navigate(['/cities', this.cityId, 'spots'], {
            state: { reload: true },
            queryParams: { cityName: this.cityData?.name }
          });
        },
        error: (err) => {
          if (err.error.detail == 'The coordinates of the spot are outside of the requested city.') {
            this.errorMessage = "Спот розташований поза межами обраного міста.";
          } else if (err.error.detail == 'The coordinates of the spot are too close to another existing spot/submission.') {
            this.errorMessage = "Спот розташований занадто близько до іншого існуючого споту або заявки.";
          } else {
            this.errorMessage = "Будь ласка, спробуйте пізніше.";
          }
        }
      });
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.imageErrors = [];

      if (input.files.length > 20) {
        this.imageErrors.push(`Можна завантажити не більше 20 фото.`);
        return;
      }

      const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      const validFiles: File[] = [];

      Array.from(input.files).forEach(file => {
        const ext = file.name.split('.').pop()?.toLowerCase();

        if (!ext || !validExtensions.includes(ext)) {
          this.imageErrors.push(`${file.name}: недопустимий тип файлу.`);
          return;
        }

        if (file.size < 1024) {
          this.imageErrors.push(`${file.name}: файл занадто малий (мінімум > 1КБ).`);
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          this.imageErrors.push(`${file.name}: файл занадто великий (максимум 5МБ).`);
          return;
        }

        validFiles.push(file);
      });

      if (this.imageErrors.length === 0) {
        this.files = validFiles;
      }
    }
  }

  onCoordinatesSelected(coords: { lat: number; lon: number }) {
    this.errorMessage = '';

    this.form.patchValue({
      latitude: coords.lat,
      longitude: coords.lon
    });
  }

  locateMe() {
    if (!navigator.geolocation) {
      alert('Геолокація не підтримується вашим браузером.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        console.log(`User's location: Latitude ${lat}, Longitude ${lon}`);

        this.mapCenter = { lat, lon };
        this.mapZoom = 17;
        this.userMarkerPosition = { lat, lon };

        this.form.patchValue({
          latitude: lat,
          longitude: lon
        });
      },
      () => alert('Не вдалося отримати вашу локацію'),
      { enableHighAccuracy: true }
    );
  }
}
