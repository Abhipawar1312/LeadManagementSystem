import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/service/users.service';
import { Users } from 'src/app/models/Users.model';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent implements OnInit {
  public UsersForm!: FormGroup;
  public UsersIdToUpdate!: number;
  public isUpdateActive: boolean = false;
  Image: any;

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: UsersService,
    private router: Router,
    private toastService: NgToastService,
  ) {
    this.UsersForm = this.fb.group({
      UserID: [''],
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      Email: ['', Validators.required],
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      DateofBirth: ['', Validators.required],
      PhoneNo: ['', Validators.required],
      MobileNo: ['', Validators.required],
      UserRole: ['', Validators.required],
      Image: ['', Validators.required]
    });
  }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe(val => {
      this.UsersIdToUpdate = val['UserID'];
      if (this.UsersIdToUpdate) {
        this.isUpdateActive = true;
        this.service.getUsersId(this.UsersIdToUpdate).subscribe(res => {
          this.fillFormToUpdate(res);
        });
      }
    })
  }

  submit() {
    if (this.UsersForm.invalid) {
      this.toastService.error({ detail: 'ERROR', summary: 'All fields are compulsory', duration: 5000, position: 'topCenter' });
      return;
    }

    const formData = new FormData();
    formData.append('jsondata', JSON.stringify(this.UsersForm.value));

    if (this.Image) {
      formData.append('Image', this.Image, this.Image.name);
    }

    this.service.postUsers(formData).subscribe(
      (res) => {
        console.log(res);
        // Handle success
        this.toastService.success({ detail: 'SUCCESS', summary: 'User Added Successfully ✔️', duration: 5000, position: 'topCenter' });
        this.UsersForm.reset();
        this.router.navigate(['lms/ManageUsers']);
      },
      (error) => {
        console.error('Error submitting product:', error);
        // Handle error
        this.toastService.error({ detail: 'ERROR', summary: 'Failed to add product', duration: 5000, position: 'topCenter' });
      }
    );
  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.Image = file;
    }
  }



  update() {
    if (this.UsersForm.invalid) {
      this.toastService.error({
        detail: 'ERROR',
        summary: 'All fields are compulsory',
        duration: 5000,
        position: 'topCenter',
      });
      return;
    }

    const formData = new FormData();
    formData.append('jsondata', JSON.stringify(this.UsersForm.value));

    if (this.Image) {
      formData.append('Image', this.Image, this.Image.name);
    }

    this.service.updateUsers(formData, this.UsersIdToUpdate).subscribe(
      (res) => {
        console.log(res);
        // Handle success
        this.toastService.success({
          detail: 'SUCCESS',
          summary: 'Product Updated Successfully ✔️',
          duration: 5000,
          position: 'topCenter',
        });
        this.UsersForm.reset();
        this.router.navigate(['lms/ManageUsers']);
      },
      (error) => {
        console.error('Error updating product:', error);
        // Handle error
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Failed to update product',
          duration: 5000,
          position: 'topCenter',
        });
      }
    );
  }

  fillFormToUpdate(UsersResponse: any[] | Users) {
    if (Array.isArray(UsersResponse) && UsersResponse.length > 0) {
      const UserData = UsersResponse[0];
      this.UsersForm.patchValue({
        UserID: UserData.UserID,
        UserName: UserData.UserName,
        Password: UserData.Password,
        Email: UserData.Email,
        FirstName: UserData.FirstName,
        LastName: UserData.LastName,
        DateofBirth: UserData.DateofBirth,
        PhoneNo: UserData.PhoneNo,
        MobileNo: UserData.MobileNo,
        UserRole: UserData.UserRole,
        Image: UserData.Image
      });

      // Handle the file separately
      if (UserData.Image) {
        this.Image = UserData.Image; // Assuming ProductData.Image is the file name string
        this.updateFileLabel(UserData.Image); // Update the file label
      }

    } else if (!Array.isArray(UsersResponse)) {
      this.UsersForm.patchValue({
        UserID: UsersResponse.UserID,
        UserName: UsersResponse.UserName,
        Password: UsersResponse.Password,
        Email: UsersResponse.Email,
        FirstName: UsersResponse.FirstName,
        LastName: UsersResponse.LastName,
        DateofBirth: UsersResponse.DateofBirth,
        PhoneNo: UsersResponse.PhoneNo,
        MobileNo: UsersResponse.MobileNo,
        UserRole: UsersResponse.UserRole,
        Image: UsersResponse.Image,
      });

      // Handle the file separately
      if (UsersResponse.Image) {
        this.Image = UsersResponse.Image; // Assuming ProductsResponse.Image is the file name string
        this.updateFileLabel(UsersResponse.Image); // Update the file label
      }

    } else {
      console.warn('No lead data found.');
    }
  }

  updateFileLabel(fileName: string) {
    // You can update a label or display the file name in a separate element
    // For example, if you have a label with an id "fileLabel", you can do the following:
    const fileLabel = document.getElementById('fileLabel');
    if (fileLabel) {
      fileLabel.textContent = fileName;
    }
  }
}
