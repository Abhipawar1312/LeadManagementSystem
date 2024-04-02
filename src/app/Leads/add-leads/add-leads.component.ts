import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { Leads } from 'src/app/models/leads.model';
import { LeadsService } from 'src/app/service/leads.service';

@Component({
  selector: 'app-add-leads',
  templateUrl: './add-leads.component.html',
  styleUrls: ['./add-leads.component.css']
})
export class AddLeadsComponent implements OnInit {
  public leadsForm!: FormGroup;
  public LeadIdToUpdate!: number;
  public isUpdateActive: boolean = false;

  public LeadStatus = ["New", "Working", "Qualified", "Failed", "Closed"];

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: LeadsService,
    private router: Router,
    private toastService: NgToastService,
  ) {
    this.leadsForm = this.fb.group({
      LeadID: [''],
      LeadName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      LeadStatus: ['', Validators.required],
      LeadSource: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      CompanyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      // CreationDate: ['', [Validators.required, this.datePatternValidator()]],
      CreationDate: ['', Validators.required],
      ModificationDate: ['', Validators.required]
    });
    console.log('FormGroup:', this.leadsForm);
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(val => {
      this.LeadIdToUpdate = val['LeadID'];
      if (this.LeadIdToUpdate) {
        this.isUpdateActive = true;
        this.service.getLeadsId(this.LeadIdToUpdate).subscribe(res => {
          this.fillFormToUpdate(res);
        });
      }
    })
  }

  // private datePatternValidator() {
  //   const datePattern = /^\d{4}-\d{2}-\d{2}$/; // Adjust the pattern as per your date format
  //   return Validators.pattern(datePattern);
  // }

  submit() {
    if (this.leadsForm.valid) {
      this.service.postLeads(this.leadsForm.value).subscribe(res => {
        this.toastService.success({
          detail: 'SUCCESS',
          summary: 'Lead Added Successfully ✔️',
          duration: 5000,
          position: 'topCenter'
        });
        this.leadsForm.reset();
        this.router.navigate(['lms/ManageLeads']);
      });
    } else {
      const leadNameControl = this.leadsForm.get('LeadName');
      const leadSourceControl = this.leadsForm.get('LeadSource');
      const CompanyNameControl = this.leadsForm.get('CompanyName');

      if (leadNameControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Lead Name should have a minimum length of 2 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (leadNameControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Lead Name should have a maximum length of 20 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (leadSourceControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Lead Source should have a minimum length of 3 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (leadSourceControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Lead Source should have a maximum length of 50 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (CompanyNameControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Company Name should have a minimum length of 3 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (CompanyNameControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Company Name should have a maximum length of 50 characters',
          duration: 5000,
          position: 'topCenter'
        });
      }
      else {
        this.validateAllFormFields(this.leadsForm);
        this.toastService.error({
          detail: 'ERROR',
          summary: 'All fields are compulsory',
          duration: 5000,
          position: 'topCenter'
        });
      }

      // const creationDateControl = this.leadsForm.get('CreationDate');
      // const modificationDateControl = this.leadsForm.get('ModificationDate');

      // if (creationDateControl?.hasError('pattern')) {
      //   this.toastService.error({
      //     detail: 'ERROR',
      //     summary: 'Invalid Creation Date format. Use MM/DD/YYYY',
      //     duration: 5000,
      //     position: 'topCenter'
      //   });
      // } else if (modificationDateControl?.hasError('pattern')) {
      //   this.toastService.error({
      //     detail: 'ERROR',
      //     summary: 'Invalid Modification Date format. Use MM/DD/YYYY',
      //     duration: 5000,
      //     position: 'topCenter'
      //   });
      // }
    }
  }


  update() {
    console.log(this.leadsForm.value);
    this.service.updateLeads(this.leadsForm.value, this.LeadIdToUpdate)
      .subscribe(res => {
        console.log(res);
        this.toastService.success({ detail: 'SUCCESS', summary: 'Lead Updated Successfully ✔️', duration: 3000, position: 'topCenter' });
        this.router.navigate(['lms/ManageLeads']);
        this.leadsForm.reset();
      });
  }

  fillFormToUpdate(leadResponse: any[] | Leads) {
    if (Array.isArray(leadResponse) && leadResponse.length > 0) {
      const leadData = leadResponse[0];
      this.leadsForm.patchValue({
        LeadID: leadData.LeadID,
        LeadName: leadData.LeadName,
        LeadStatus: leadData.LeadStatus,
        LeadSource: leadData.LeadSource,
        CompanyName: leadData.CompanyName,
        CreationDate: leadData.CreationDate,
        ModificationDate: leadData.ModificationDate
        // ... other properties
      });
    } else if (!Array.isArray(leadResponse)) {
      console.log('Filling form with Lead:', leadResponse);
      this.leadsForm.patchValue({
        LeadID: leadResponse.LeadID,
        LeadName: leadResponse.LeadName,
        LeadStatus: leadResponse.LeadStatus,
        LeadSource: leadResponse.LeadSource,
        CompanyName: leadResponse.CompanyName,
        CreationDate: leadResponse.CreationDate,
        ModificationDate: leadResponse.ModificationDate
      });
    } else {
      console.warn('No lead data found.');
    }
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    })
  }
}
