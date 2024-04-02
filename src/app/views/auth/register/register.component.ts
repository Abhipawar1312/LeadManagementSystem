import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { UserRegistrationService } from 'src/app/service/user-registration.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  registrationForm!: FormGroup

  Role = ["manager", "agent"];

  constructor(private fb: FormBuilder, private service: UserRegistrationService, private r: Router, private toastService: NgToastService) { }

  ngOnInit() {

    this.registrationForm = this.fb.group({

      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      UserName: ['', Validators.required],
      UserEmail: ['', Validators.required],
      UserPassword: ['', Validators.required],
      Role: ['', Validators.required],
      PhoneNo: ['', Validators.required],
    })

  }

  RegistrationUser() {
    if (this.registrationForm.valid) {

      this.service.UserRegistration(this.registrationForm.value).subscribe((data) => {
        console.log(this.registrationForm.value);
        if (data == "Registration Successfully Done.") {
          this.toastService.success({ detail: 'Success', summary: "Registration Successfully Done.", duration: 5000, position: 'topCenter' });
          setTimeout(() => {
            this.r.navigate(["login"]);
          }, 3000);
        } else if (data == "Email already exists. Registration failed.") {
          this.registrationForm.get('UserEmail')?.setErrors({ 'emailNotFound': true });

          this.toastService.error({ detail: 'Error', summary: "Email already exists. Registration failed.", duration: 5000, position: 'topCenter' });

          this.registrationForm.get('UserEmail')?.reset();
        } else if (data == "Invalid email format. Registration failed.") {
          this.registrationForm.get('UserEmail')?.setErrors({ 'emailNotFound': true });

          this.toastService.error({ detail: 'Error', summary: "Invalid email format. Registration failed.", duration: 5000, position: 'topCenter' });
          // alert(data);
        } else if (data == "Invalid password format. Password should be at least 8 characters and contain at least one letter and one digit. Registration failed.") {
          this.registrationForm.get('UserPassword')?.setErrors({ 'incorrectPassword': true });

          this.toastService.error({ detail: 'Error', summary: "Invalid password format. Password should be at least 8 characters and contain at least one letter and one digit.", duration: 5000, position: 'topCenter' });
          // alert(data);
        }
        else {
          alert(data);
        }

      });
    } else {
      this.validateAllFormFields(this.registrationForm);
      this.toastService.error({ detail: 'Error', summary: "Your form is invalid", duration: 5000, position: 'topCenter' });
      // alert("Your form is invalid");
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
