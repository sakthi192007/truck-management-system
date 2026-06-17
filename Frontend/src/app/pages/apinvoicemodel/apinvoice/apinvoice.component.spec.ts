import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APinvoiceComponent } from './apinvoice.component';

describe('APinvoiceComponent', () => {
  let component: APinvoiceComponent;
  let fixture: ComponentFixture<APinvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APinvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(APinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
