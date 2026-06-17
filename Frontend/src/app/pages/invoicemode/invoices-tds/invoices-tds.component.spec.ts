import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesTDSComponent } from './invoices-tds.component';

describe('InvoicesTDSComponent', () => {
  let component: InvoicesTDSComponent;
  let fixture: ComponentFixture<InvoicesTDSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesTDSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoicesTDSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
