import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUpgradeModalComponent } from './post-upgrade-modal.component';

describe('PostUpgradeModalComponent', () => {
  let component: PostUpgradeModalComponent;
  let fixture: ComponentFixture<PostUpgradeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostUpgradeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostUpgradeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
