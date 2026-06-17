import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceperformanceinvoiceComponent } from './serviceperformanceinvoice.component';

describe('ServiceperformanceinvoiceComponent', () => {
  let component: ServiceperformanceinvoiceComponent;
  let fixture: ComponentFixture<ServiceperformanceinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceperformanceinvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceperformanceinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
