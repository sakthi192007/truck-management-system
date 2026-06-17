import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationroutemapComponent } from './locationroutemap.component';

describe('LocationroutemapComponent', () => {
  let component: LocationroutemapComponent;
  let fixture: ComponentFixture<LocationroutemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationroutemapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LocationroutemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
