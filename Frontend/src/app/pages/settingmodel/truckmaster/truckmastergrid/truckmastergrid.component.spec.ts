import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckmastergridComponent } from './truckmastergrid.component';

describe('TruckmastergridComponent', () => {
  let component: TruckmastergridComponent;
  let fixture: ComponentFixture<TruckmastergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckmastergridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TruckmastergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
