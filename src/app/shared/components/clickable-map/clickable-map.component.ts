import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

const UserMarkerIcon = L.icon({
  iconUrl: 'icons/leaflet/marker-icon-red.png',
  iconRetinaUrl: 'icons/leaflet/marker-icon-red-2x.png',
  shadowUrl: 'icons/leaflet/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
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
  private preloadedMarkers: L.Marker[] = [];
  private userMarker: L.Marker | null = null;

  @Output() coordinates = new EventEmitter<{ lat: number; lon: number }>();

  @Input() preloadedMarkerPositions: { lat: number; lon: number }[] = [];
  @Input() userMarkerPosition?: { lat: number; lon: number };
  @Input() center?: { lat: number; lon: number };
  @Input() zoom: number = 13;
  @Input() allowMarkerSet: boolean = true;

  ngAfterViewInit(): void {
    this.initMap();

    this.preloadedMarkerPositions.forEach(pos => this.addMarker(pos.lat, pos.lon));

    if (this.userMarkerPosition) {
      this.addUserMarker(this.userMarkerPosition.lat, this.userMarkerPosition.lon);
    }

    this.setCenterAndZoom();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return;

    if (changes['center']) {
      this.setCenterAndZoom();
    }

    if (changes['preloadedMarkerPositions']) {
      this.clearPreloadedMarkers();
      this.addPreloadedMarkers();
    }

    if (changes['userMarkerPosition']) {
      if (this.userMarkerPosition) {
        this.addUserMarker(this.userMarkerPosition.lat, this.userMarkerPosition.lon);
      }
    }

    if (changes['zoom']) {
      this.setCenterAndZoom();
    }
  }

  private addPreloadedMarkers(): void {
    this.preloadedMarkerPositions.forEach(pos => this.addMarker(pos.lat, pos.lon));
  }

  private clearPreloadedMarkers(): void {
    this.preloadedMarkers.forEach(m => m.remove());
    this.preloadedMarkers = [];
  }

  private addMarker(lat: number, lon: number): void {
    const marker = L.marker([lat, lon]).addTo(this.map);
    this.preloadedMarkers.push(marker);
  }

  private setCenterAndZoom(): void {
    if (this.center) {
      this.map.flyTo([this.center.lat, this.center.lon], this.zoom, {
        animate: true,
        // 0.7 seconds
        duration: 0.7
      });
    }
  }

  private initMap(): void {
    const defaultCenter: L.LatLngExpression = [48.3794, 31.1656]; // Ukraine center
    const ukraineBounds: L.LatLngBoundsExpression = [
      [44.0, 22.0],
      [52.5, 40.0]
    ];

    this.map = L.map('map', {
      center: defaultCenter,
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
        this.addUserMarker(lat, lng);

        this.coordinates.emit({ lat: lat, lon: lng });
      });
    }
  }

  private addUserMarker(lat: number, lon: number): void {
    if (this.userMarker) {
      this.userMarker.setLatLng([lat, lon]);
    } else {
      this.userMarker = L.marker([lat, lon], { icon: UserMarkerIcon }).addTo(this.map);
    }
  }
}
