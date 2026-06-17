import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceperformanceinvoiceimportComponent } from './serviceperformanceinvoiceimport.component';

describe('ServiceperformanceinvoiceimportComponent', () => {
  let component: ServiceperformanceinvoiceimportComponent;
  let fixture: ComponentFixture<ServiceperformanceinvoiceimportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceperformanceinvoiceimportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceperformanceinvoiceimportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
