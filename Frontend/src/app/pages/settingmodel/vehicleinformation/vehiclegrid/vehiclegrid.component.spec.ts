import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclegridComponent } from './vehiclegrid.component';

describe('VehiclegridComponent', () => {
  let component: VehiclegridComponent;
  let fixture: ComponentFixture<VehiclegridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclegridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehiclegridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
