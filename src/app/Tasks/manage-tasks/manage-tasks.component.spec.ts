import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTasksComponent } from './manage-tasks.component';

describe('ManageTasksComponent', () => {
  let component: ManageTasksComponent;
  let fixture: ComponentFixture<ManageTasksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageTasksComponent]
    });
    fixture = TestBed.createComponent(ManageTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
