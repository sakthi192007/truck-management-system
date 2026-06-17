import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicePerformanceExportComponent } from './service-performance-export.component';

describe('ServicePerformanceExportComponent', () => {
  let component: ServicePerformanceExportComponent;
  let fixture: ComponentFixture<ServicePerformanceExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicePerformanceExportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicePerformanceExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
