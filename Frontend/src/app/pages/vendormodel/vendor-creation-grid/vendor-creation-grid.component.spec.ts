import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCreationGridComponent } from './vendor-creation-grid.component';

describe('VendorCreationGridComponent', () => {
  let component: VendorCreationGridComponent;
  let fixture: ComponentFixture<VendorCreationGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorCreationGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VendorCreationGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
