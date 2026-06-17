import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfsaddingComponent } from './cfsadding.component';

describe('CfsaddingComponent', () => {
  let component: CfsaddingComponent;
  let fixture: ComponentFixture<CfsaddingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfsaddingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CfsaddingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
