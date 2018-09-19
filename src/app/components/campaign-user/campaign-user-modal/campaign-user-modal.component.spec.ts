import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignUserModalComponent } from './campaign-user-modal.component';

describe('CampaignUserModalComponent', () => {
  let component: CampaignUserModalComponent;
  let fixture: ComponentFixture<CampaignUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
