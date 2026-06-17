import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignmasterComponent } from './campaignmaster.component';

describe('CampaignmasterComponent', () => {
  let component: CampaignmasterComponent;
  let fixture: ComponentFixture<CampaignmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampaignmasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CampaignmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
