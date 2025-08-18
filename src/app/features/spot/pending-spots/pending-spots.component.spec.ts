import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSpotsComponent } from './pending-spots.component';

describe('PendingSpotsComponent', () => {
  let component: PendingSpotsComponent;
  let fixture: ComponentFixture<PendingSpotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingSpotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingSpotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
