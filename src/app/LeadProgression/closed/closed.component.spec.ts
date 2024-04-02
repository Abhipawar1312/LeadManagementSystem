import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedComponent } from './closed.component';

describe('ClosedComponent', () => {
  let component: ClosedComponent;
  let fixture: ComponentFixture<ClosedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClosedComponent]
    });
    fixture = TestBed.createComponent(ClosedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
