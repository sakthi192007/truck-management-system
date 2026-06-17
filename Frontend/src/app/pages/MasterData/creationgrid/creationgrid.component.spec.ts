import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationgridComponent } from './creationgrid.component';

describe('CreationgridComponent', () => {
  let component: CreationgridComponent;
  let fixture: ComponentFixture<CreationgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationgridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreationgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
