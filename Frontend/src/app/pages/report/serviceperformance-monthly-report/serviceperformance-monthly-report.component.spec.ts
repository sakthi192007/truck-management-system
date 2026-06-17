import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceperformanceMonthlyReportComponent } from './serviceperformance-monthly-report.component';

describe('ServiceperformanceMonthlyReportComponent', () => {
  let component: ServiceperformanceMonthlyReportComponent;
  let fixture: ComponentFixture<ServiceperformanceMonthlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceperformanceMonthlyReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceperformanceMonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
