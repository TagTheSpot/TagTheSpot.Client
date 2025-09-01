import { Component, Input } from '@angular/core';
import { SpotResponse } from '../../../core/spot/spot-response.model';

@Component({
  selector: 'app-spot-badges',
  imports: [],
  templateUrl: './spot-badges.component.html',
  styleUrl: './spot-badges.component.scss'
})
export class SpotBadgesComponent {
  @Input() spot!: SpotResponse;
}
