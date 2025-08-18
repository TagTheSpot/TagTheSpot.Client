import { Component, inject, OnInit } from '@angular/core';
import { SpotService } from '../../../core/spot/spot.service';
import { ActivatedRoute } from '@angular/router';
import { SpotRequest } from '../../../core/spot/spot-request.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-submit-spot',
  imports: [FormsModule, CommonModule],
  templateUrl: './submit-spot.component.html',
  styleUrl: './submit-spot.component.scss'
})
export class SubmitSpotComponent implements OnInit {
  spotService = inject(SpotService);
  route = inject(ActivatedRoute);

  spotRequest: SpotRequest = {
    cityId: '',
    latitude: 0,
    longitude: 0,
    type: '',
    description: '',
    isCovered: null,
    lighting: null,
    skillLevel: null,
    accessibility: null,
    condition: null,
    images: []
  };

  ngOnInit(): void {
    const cityId = this.route.snapshot.paramMap.get('id') ?? undefined;

    if (!cityId) {
      console.error("City ID is not passed in the route.");
    }
    else {
      this.spotRequest.cityId = cityId;
    }
  }

  onSubmit() {
    this.spotService.submitSpot(this.spotRequest).subscribe({
      next: () => alert('Spot submitted successfully!'),
      error: (err) => console.error('Error submitting spot', err)
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.spotRequest.images = Array.from(input.files);
    }
  }
}