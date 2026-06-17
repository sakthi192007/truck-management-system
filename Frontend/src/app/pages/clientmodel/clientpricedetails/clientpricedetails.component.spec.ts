import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientpricedetailsComponent } from './clientpricedetails.component';

describe('ClientpricedetailsComponent', () => {
  let component: ClientpricedetailsComponent;
  let fixture: ComponentFixture<ClientpricedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientpricedetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientpricedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
