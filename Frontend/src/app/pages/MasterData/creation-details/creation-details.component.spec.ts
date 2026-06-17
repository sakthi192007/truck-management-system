import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationDetailsComponent } from './creation-details.component';

describe('CreationDetailsComponent', () => {
  let component: CreationDetailsComponent;
  let fixture: ComponentFixture<CreationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
