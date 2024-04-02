import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/service/auth.service';
import { UserloginService } from 'src/app/service/userlogin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private service: UserloginService, private toastService: NgToastService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      UserEmail: ['', Validators.required],
      UserPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.service.UserLogin(this.loginForm.value).subscribe((data) => {
        console.log(data)
        if (data === "Login Successful") {
          this.toastService.success({ detail: 'SUCCESS', summary: 'Login Successful', duration: 5000, position: 'topCenter' });
          sessionStorage.setItem("isLoginUser", "true");
          setTimeout(() => {
            this.router.navigate(["lms/dashboard"]);
          }, 2000);

        } else if (data === "Email not found") {
          this.loginForm.get('UserEmail')?.setErrors({ 'emailNotFound': true });

          this.toastService.error({ detail: 'Error', summary: "Email not found", duration: 5000, position: 'topCenter' });

        } else {
          this.loginForm.get('UserPassword')?.setErrors({ 'incorrectPassword': true });

          this.toastService.error({ detail: 'Error', summary: "Incorrect Password", duration: 5000, position: 'topCenter' });
        }
      })

    } else {
      this.validateAllFormFields(this.loginForm);
      this.toastService.error({ detail: 'Error', summary: "Your form is invalid", duration: 5000, position: 'topCenter' });

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
