import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitySpotsComponent } from './city-spots.component';

describe('CitySpotsComponent', () => {
  let component: CitySpotsComponent;
  let fixture: ComponentFixture<CitySpotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySpotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitySpotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
