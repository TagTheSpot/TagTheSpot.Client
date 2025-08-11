import { Component, inject, Input, OnInit } from '@angular/core';
import { SpotRequest } from '../../../core/spot/spot-request.model';
import { SpotService } from '../../../core/spot/spot.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-spot',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-spot.component.html',
  styleUrl: './add-spot.component.scss'
})
export class AddSpotComponent implements OnInit {
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
    this.spotService.addSpot(this.spotRequest).subscribe({
      next: () => alert('Spot added successfully!'),
      error: (err) => console.error('Error adding spot', err)
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.spotRequest.images = Array.from(input.files);
    }
  }
}
