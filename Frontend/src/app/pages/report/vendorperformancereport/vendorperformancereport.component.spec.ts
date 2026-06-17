import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorperformancereportComponent } from './vendorperformancereport.component';

describe('VendorperformancereportComponent', () => {
  let component: VendorperformancereportComponent;
  let fixture: ComponentFixture<VendorperformancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorperformancereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorperformancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
