import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorpricedetailsComponent } from './vendorpricedetails.component';

describe('VendorpricedetailsComponent', () => {
  let component: VendorpricedetailsComponent;
  let fixture: ComponentFixture<VendorpricedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorpricedetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorpricedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
