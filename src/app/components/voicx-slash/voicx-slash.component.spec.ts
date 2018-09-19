import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoicxSlashComponent } from './voicx-slash.component';

describe('VoicxSlashComponent', () => {
  let component: VoicxSlashComponent;
  let fixture: ComponentFixture<VoicxSlashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoicxSlashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoicxSlashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
