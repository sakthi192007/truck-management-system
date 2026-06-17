import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTinvoicereportComponent } from './gstinvoicereport.component';

describe('GSTinvoicereportComponent', () => {
  let component: GSTinvoicereportComponent;
  let fixture: ComponentFixture<GSTinvoicereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GSTinvoicereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GSTinvoicereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
