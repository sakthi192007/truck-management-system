import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildmenuComponent } from './childmenu.component';

describe('ChildmenuComponent', () => {
  let component: ChildmenuComponent;
  let fixture: ComponentFixture<ChildmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildmenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChildmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
