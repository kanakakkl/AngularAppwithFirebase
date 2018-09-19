import { TestBed, inject } from '@angular/core/testing';

import { PostUpgradeService } from './post-upgrade.service';

describe('PostUpgradeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PostUpgradeService]
    });
  });

  it('should be created', inject([PostUpgradeService], (service: PostUpgradeService) => {
    expect(service).toBeTruthy();
  }));
});
