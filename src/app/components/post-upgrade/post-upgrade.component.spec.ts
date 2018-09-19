import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostUpgradeComponent } from './post-upgrade.component';

describe('PostUpgradeComponent', () => {
  let component: PostUpgradeComponent;
  let fixture: ComponentFixture<PostUpgradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostUpgradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
