import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicestdsgridComponent } from './invoicestdsgrid.component';

describe('InvoicestdsgridComponent', () => {
  let component: InvoicestdsgridComponent;
  let fixture: ComponentFixture<InvoicestdsgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicestdsgridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvoicestdsgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
