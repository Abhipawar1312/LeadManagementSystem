import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailedComponent } from './failed.component';

describe('FailedComponent', () => {
  let component: FailedComponent;
  let fixture: ComponentFixture<FailedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FailedComponent]
    });
    fixture = TestBed.createComponent(FailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
