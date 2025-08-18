import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitSpotComponent } from './submit-spot.component';

describe('SubmitSpotComponent', () => {
  let component: SubmitSpotComponent;
  let fixture: ComponentFixture<SubmitSpotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitSpotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitSpotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
