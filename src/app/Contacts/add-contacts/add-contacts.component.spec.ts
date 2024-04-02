import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactsComponent } from './add-contacts.component';

describe('AddContactsComponent', () => {
  let component: AddContactsComponent;
  let fixture: ComponentFixture<AddContactsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddContactsComponent]
    });
    fixture = TestBed.createComponent(AddContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
