import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatetruckmasterComponent } from './createtruckmaster.component';

describe('CreatetruckmasterComponent', () => {
  let component: CreatetruckmasterComponent;
  let fixture: ComponentFixture<CreatetruckmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatetruckmasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreatetruckmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
