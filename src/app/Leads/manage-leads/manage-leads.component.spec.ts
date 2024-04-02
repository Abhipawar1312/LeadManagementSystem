import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLeadsComponent } from './manage-leads.component';

describe('ManageLeadsComponent', () => {
  let component: ManageLeadsComponent;
  let fixture: ComponentFixture<ManageLeadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageLeadsComponent]
    });
    fixture = TestBed.createComponent(ManageLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
