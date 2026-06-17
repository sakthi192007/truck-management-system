import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APinvoiceGridComponent } from './apinvoice-grid.component';

describe('APinvoiceGridComponent', () => {
  let component: APinvoiceGridComponent;
  let fixture: ComponentFixture<APinvoiceGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APinvoiceGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(APinvoiceGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
