import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickableMapComponent } from './clickable-map.component';

describe('ClickableMapComponent', () => {
  let component: ClickableMapComponent;
  let fixture: ComponentFixture<ClickableMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClickableMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClickableMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
