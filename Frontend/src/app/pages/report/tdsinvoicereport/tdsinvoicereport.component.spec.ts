import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsinvoicereportComponent } from './tdsinvoicereport.component';

describe('TdsinvoicereportComponent', () => {
  let component: TdsinvoicereportComponent;
  let fixture: ComponentFixture<TdsinvoicereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TdsinvoicereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TdsinvoicereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
