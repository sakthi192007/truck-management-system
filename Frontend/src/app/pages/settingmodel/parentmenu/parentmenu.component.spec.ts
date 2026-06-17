import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentmenuComponent } from './parentmenu.component';

describe('ParentmenuComponent', () => {
  let component: ParentmenuComponent;
  let fixture: ComponentFixture<ParentmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParentmenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParentmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
