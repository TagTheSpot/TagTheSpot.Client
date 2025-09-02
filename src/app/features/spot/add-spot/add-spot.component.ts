import { Component, inject, OnInit } from '@angular/core';
import { SpotRequest } from '../../../core/spot/spot-request.model';
import { SpotService } from '../../../core/spot/spot.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClickableMapComponent } from '../../../shared/components/clickable-map/clickable-map.component';
import { ToastService } from '../../../shared/services/toast.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-add-spot',
  imports: [RouterModule, ReactiveFormsModule, ClickableMapComponent],
  templateUrl: './add-spot.component.html',
  styleUrl: './add-spot.component.scss'
})
export class AddSpotComponent implements OnInit {
  fb = inject(FormBuilder);
  spotService = inject(SpotService);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  errorMessage: string = '';
  cityId: string = '';
  cityName: string = '';

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

    this.route.queryParamMap.subscribe(queryParams => {
      const cityName = queryParams.get('cityName');

      if (cityName) {
        this.cityName = cityName;
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
      //TODO
      this.toastService.show('✅ Заявку успішно додано!');
      this.router.navigate(['/submissions'], {
        state: { reload: true }
      });
      // this.spotService.submitSpot(spotRequest).subscribe({
      //   next: () => {
      //     this.toastService.show('✅ Заявку успішно додано!');
      //     this.router.navigate(['/submissions'], {
      //       state: { reload: true }
      //     });
      //   },
      //   error: () => {
      //     this.errorMessage = "Будь ласка, спробуйте пізніше.";
      //   }
      // });
    } else {
      this.spotService.addSpot(spotRequest).subscribe({
        next: () => {
          this.toastService.show('✅ Спот успішно додано!');
          this.router.navigate(['/cities', this.cityId, 'spots'], {
            state: { reload: true },
            queryParams: { cityName: this.cityName }
          });
        },
        error: () => {
          this.errorMessage = "Будь ласка, спробуйте пізніше.";
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
}
