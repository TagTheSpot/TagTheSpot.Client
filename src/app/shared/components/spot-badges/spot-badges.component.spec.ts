import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotBadgesComponent } from './spot-badges.component';

describe('SpotBadgesComponent', () => {
  let component: SpotBadgesComponent;
  let fixture: ComponentFixture<SpotBadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotBadgesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpotBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
