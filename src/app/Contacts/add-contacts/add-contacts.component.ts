import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from 'src/app/service/contacts.service';
import { Contacts } from 'src/app/models/Contacts.model';
import { LeadsService } from 'src/app/service/leads.service';
@Component({
  selector: 'app-add-contacts',
  templateUrl: './add-contacts.component.html',
  styleUrls: ['./add-contacts.component.css']
})
export class AddContactsComponent implements OnInit {
  public ContactsForm!: FormGroup;
  public ContactIdToUpdate!: number;
  public isUpdateActive: boolean = false;
  public LeadPriority = ["Low", "Medium", "High"]
  public LeadStatus = ["New", "Working", "Contacted", "Qualified", "Failed", "Closed"];

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: ContactsService,
    private router: Router,
    private toastService: NgToastService,
    private leadsService: LeadsService
  ) {
    this.ContactsForm = this.fb.group({
      ContactID: [''],
      LeadSource: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      LeadFor: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      LeadPriority: ['', Validators.required],
      FirstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      LastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]{10}$")]],
      Email: ['', [Validators.required, Validators.email]],
      Address: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.getLeads();
    this.activatedRoute.params.subscribe(val => {
      this.ContactIdToUpdate = val['ContactID'];
      if (this.ContactIdToUpdate) {
        this.isUpdateActive = true;
        this.service.getContactsId(this.ContactIdToUpdate).subscribe(res => {
          this.fillFormToUpdate(res);
        });
      }
    });

  }

  submit() {
    if (this.ContactsForm.valid) {
      console.log(this.ContactsForm.value);
      this.service.postContacts(this.ContactsForm.value).subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'Contact Added Successfully ✔️', duration: 5000, position: 'topCenter' });
        this.ContactsForm.reset();
        this.router.navigate(['lms/ManageContacts']);
      });
    } else {
      const LeadSourceControl = this.ContactsForm.get('LeadSource');
      const LeadForControl = this.ContactsForm.get('LeadFor');
      const FirstNameControl = this.ContactsForm.get('FirstName');
      const LastNameControl = this.ContactsForm.get('LastName');
      const AddressControl = this.ContactsForm.get('Address');
      const MobileNoControl = this.ContactsForm.get('MobileNo');
      const EmailControl = this.ContactsForm.get('Email');

      if (LeadSourceControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Lead Source should have a minimum length of 2 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (LeadSourceControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Lead Source should have a maximum length of 20 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (LeadForControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Lead For should have a minimum length of 2 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (LeadForControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Lead For should have a maximum length of 20 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (FirstNameControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'First Name should have a minimum length of 2 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (FirstNameControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'First Name should have a maximum length of 20 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (LastNameControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Last Name should have a minimum length of 2 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (LastNameControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Last Name should have a maximum length of 20 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (AddressControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Address should have a minimum length of 2 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (AddressControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Address should have a maximum length of 50 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (MobileNoControl?.hasError('pattern')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Mobile number should have exactly 10 numeric characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (EmailControl?.hasError('email')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Invalid email format',
          duration: 5000,
          position: 'topCenter'
        });
      } else {
        this.toastService.error({ detail: 'ERROR', summary: 'All fields are compulsory', duration: 5000, position: 'topCenter' });
      }
    }
  }


  update() {
    console.log(this.ContactsForm.value);
    this.service.updateContacts(this.ContactsForm.value, this.ContactIdToUpdate)
      .subscribe(res => {
        console.log(res);
        this.toastService.success({ detail: 'SUCCESS', summary: 'Contact Updated Successfully ✔️', duration: 3000, position: 'topCenter' });
        this.router.navigate(['lms/ManageContacts']);
        this.ContactsForm.reset();
      });
  }

  fillFormToUpdate(ContactResponse: any[] | Contacts) {
    if (Array.isArray(ContactResponse) && ContactResponse.length > 0) {
      const ContactData = ContactResponse[0];
      console.log('Filling form with Lead:', ContactData);
      this.ContactsForm.patchValue({
        ContactID: ContactData.ContactID,
        LeadID: ContactData.LeadID,
        LeadFor: ContactData.LeadFor,
        LeadSource: ContactData.LeadSource,
        LeadPriority: ContactData.LeadPriority,
        FirstName: ContactData.FirstName,
        LastName: ContactData.LastName,
        MobileNo: ContactData.MobileNo,
        Email: ContactData.Email,
        Address: ContactData.Address

      });
    } else if (!Array.isArray(ContactResponse)) {
      console.log('Filling form with Lead:', ContactResponse);
      this.ContactsForm.patchValue({
        ContactID: ContactResponse.ContactID,
        LeadID: ContactResponse.LeadID,
        LeadFor: ContactResponse.LeadFor,
        LeadSource: ContactResponse.LeadSource,
        LeadPriority: ContactResponse.LeadPriority,
        FirstName: ContactResponse.FirstName,
        LastName: ContactResponse.LastName,
        MobileNo: ContactResponse.MobileNo,
        Email: ContactResponse.Email,
        Address: ContactResponse.Address
      });
    } else {
      console.warn('No lead data found.');
    }
  }

  getLeads() {
    this.leadsService.getLeads().subscribe({
      next: (res) => {
        console.log(res[res.length - 1]);
        let value = res[res.length - 1];
        this.ContactsForm.patchValue({
          LeadFor: value.LeadName,
          LeadSource: value.LeadSource
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
