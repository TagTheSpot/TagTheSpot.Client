import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, AfterViewInit, Input } from '@angular/core';
import * as L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'icons/leaflet/marker-icon.png',
  iconRetinaUrl: 'icons/leaflet/marker-icon-2x.png',
  shadowUrl: 'icons/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

@Component({
  selector: 'app-clickable-map',
  imports: [CommonModule],
  templateUrl: './clickable-map.component.html',
  styleUrl: './clickable-map.component.scss'
})
export class ClickableMapComponent implements AfterViewInit {
  private map!: L.Map;
  private marker!: L.Marker;

  @Output() coordinates = new EventEmitter<{ lat: number; lon: number }>();

  @Input() markerPosition?: { lat: number; lon: number };
  @Input() zoom: number = 12;
  @Input() allowMarkerSet: boolean = true;

  ngAfterViewInit(): void {
    this.initMap();
    
    if (this.markerPosition) {
      this.setMarker(this.markerPosition.lat, this.markerPosition.lon, this.zoom);
    }
  }

  private setMarker(lat: number, lon: number, zoomLevel?: number): void {
    if (this.marker) {
      this.marker.setLatLng([lat, lon]);
    } else {
      this.marker = L.marker([lat, lon]).addTo(this.map);
    }

    if (zoomLevel) {
      this.map.setView([lat, lon], zoomLevel);
    } else {
      this.map.panTo([lat, lon]);
    }
  }

  private initMap(): void {
    // Approximate center of Ukraine
    const ukraineCenter: L.LatLngExpression = [48.3794, 31.1656];

    const ukraineBounds: L.LatLngBoundsExpression = [
      [44.0, 22.0], // southwest corner
      [52.5, 40.0]  // northeast corner
    ];

    this.map = L.map('map', {
      center: ukraineCenter,
      zoom: 6,
      minZoom: 6,
      maxZoom: 18,
      maxBounds: ukraineBounds, 
      maxBoundsViscosity: 1.0
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    
    if (this.allowMarkerSet) {
      this.map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        this.setMarker(lat, lng);

        this.coordinates.emit({ lat, lon: lng });
      });
    }
  }
}
