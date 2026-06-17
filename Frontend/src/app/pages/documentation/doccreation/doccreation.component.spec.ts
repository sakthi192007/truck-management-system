import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoccreationComponent } from './doccreation.component';

describe('DoccreationComponent', () => {
  let component: DoccreationComponent;
  let fixture: ComponentFixture<DoccreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoccreationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoccreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
