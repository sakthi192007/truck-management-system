import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingallocationgridComponent } from './bookingallocationgrid.component';

describe('BookingallocationgridComponent', () => {
  let component: BookingallocationgridComponent;
  let fixture: ComponentFixture<BookingallocationgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingallocationgridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingallocationgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
