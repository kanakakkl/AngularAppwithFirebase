import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignUserComponent } from './campaign-user.component';

describe('CampaignUserComponent', () => {
  let component: CampaignUserComponent;
  let fixture: ComponentFixture<CampaignUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
