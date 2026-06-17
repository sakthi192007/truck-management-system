import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterlocationgridComponent } from './masterlocationgrid.component';

describe('MasterlocationgridComponent', () => {
  let component: MasterlocationgridComponent;
  let fixture: ComponentFixture<MasterlocationgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasterlocationgridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MasterlocationgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
