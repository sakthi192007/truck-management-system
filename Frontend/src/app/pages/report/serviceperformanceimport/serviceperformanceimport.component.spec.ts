import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceperformanceimportComponent } from './serviceperformanceimport.component';

describe('ServiceperformanceimportComponent', () => {
  let component: ServiceperformanceimportComponent;
  let fixture: ComponentFixture<ServiceperformanceimportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceperformanceimportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceperformanceimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
