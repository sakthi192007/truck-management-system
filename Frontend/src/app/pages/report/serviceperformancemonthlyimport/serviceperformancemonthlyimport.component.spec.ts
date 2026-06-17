import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceperformancemonthlyimportComponent } from './serviceperformancemonthlyimport.component';

describe('ServiceperformancemonthlyimportComponent', () => {
  let component: ServiceperformancemonthlyimportComponent;
  let fixture: ComponentFixture<ServiceperformancemonthlyimportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceperformancemonthlyimportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceperformancemonthlyimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
