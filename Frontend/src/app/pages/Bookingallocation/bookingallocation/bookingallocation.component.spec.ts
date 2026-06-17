import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingallocationComponent } from './bookingallocation.component';

describe('BookingallocationComponent', () => {
  let component: BookingallocationComponent;
  let fixture: ComponentFixture<BookingallocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingallocationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookingallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
