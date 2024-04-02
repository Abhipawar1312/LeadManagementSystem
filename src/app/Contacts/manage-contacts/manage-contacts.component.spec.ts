import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContactsComponent } from './manage-contacts.component';

describe('ManageContactsComponent', () => {
  let component: ManageContactsComponent;
  let fixture: ComponentFixture<ManageContactsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageContactsComponent]
    });
    fixture = TestBed.createComponent(ManageContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
