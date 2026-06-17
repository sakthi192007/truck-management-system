import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportvendorperformancereportComponent } from './importvendorperformancereport.component';

describe('ImportvendorperformancereportComponent', () => {
  let component: ImportvendorperformancereportComponent;
  let fixture: ComponentFixture<ImportvendorperformancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportvendorperformancereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportvendorperformancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
