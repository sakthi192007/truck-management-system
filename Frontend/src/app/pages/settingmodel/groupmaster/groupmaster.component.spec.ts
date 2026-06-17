import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupmasterComponent } from './groupmaster.component';

describe('GroupmasterComponent', () => {
  let component: GroupmasterComponent;
  let fixture: ComponentFixture<GroupmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupmasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
