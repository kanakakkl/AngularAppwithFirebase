import { TestBed, inject } from '@angular/core/testing';

import { CampaignUserService } from './campaign-user.service';

describe('CampaignUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CampaignUserService]
    });
  });

  it('should be created', inject([CampaignUserService], (service: CampaignUserService) => {
    expect(service).toBeTruthy();
  }));
});
