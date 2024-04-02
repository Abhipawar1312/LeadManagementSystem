import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/service/products.service';
import { products } from 'src/app/models/products.model';
@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent implements OnInit {
  public ProductsForm!: FormGroup;
  public ProductsIdToUpdate!: number;
  public isUpdateActive: boolean = false;
  ProductID: any;
  ProductName: any;
  Description: any;
  Price: any;
  Image: any;

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private service: ProductsService,
    private router: Router,
    private toastService: NgToastService,
  ) {
    this.ProductsForm = this.fb.group({
      ProductID: [''],
      ProductName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      Description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      Price: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]],
      Image: [null, Validators.required]
    });
    console.log('FormGroup:', this.ProductsForm);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val => {
      this.ProductsIdToUpdate = val['ProductID'];
      if (this.ProductsIdToUpdate) {
        this.isUpdateActive = true;
        this.service.getproductsId(this.ProductsIdToUpdate).subscribe(res => {
          this.fillFormToUpdate(res);
        });
      }
    })
  }

  submit() {
    if (this.ProductsForm.valid) {
      const formData = new FormData();
      formData.append('jsondata', JSON.stringify(this.ProductsForm.value));

      if (this.Image) {
        formData.append('Image', this.Image, this.Image.name);
      }

      this.service.postproducts(formData).subscribe(
        (res) => {
          console.log(res);
          // Handle success
          this.toastService.success({ detail: 'SUCCESS', summary: 'Product Added Successfully ✔️', duration: 5000, position: 'topCenter' });
          this.ProductsForm.reset();
          this.router.navigate(['lms/ManageProducts']);
        },
        (error) => {
          console.error('Error submitting product:', error);
          // Handle error
          this.toastService.error({ detail: 'ERROR', summary: 'Failed to add product', duration: 5000, position: 'topCenter' });
        }
      );
    } else {
      const ProductNameControl = this.ProductsForm.get('ProductName');
      const DescriptionControl = this.ProductsForm.get('Description');
      const PriceControl = this.ProductsForm.get('Price');

      if (ProductNameControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Product Name should have a minimum length of 3 character',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (ProductNameControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Product Name should have a maximum length of 20 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (DescriptionControl?.hasError('minlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Description should have a minimum length of 3 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (DescriptionControl?.hasError('maxlength')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Description should have a maximum length of 50 characters',
          duration: 5000,
          position: 'topCenter'
        });
      } else if (PriceControl?.hasError('pattern')) {
        this.toastService.error({
          detail: 'ERROR',
          summary: 'Invalid Price Format. Please enter a valid number.',
          duration: 5000,
          position: 'topCenter'
        });
      }
      else {
        this.toastService.error({ detail: 'ERROR', summary: 'All fields are compulsory', duration: 5000, position: 'topCenter' });
      }
    }


  }
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.Image = file;
    }
  }



  update() {
    if (this.ProductsForm.invalid) {
      this.toastService.error({
        detail: 'ERROR',
        summary: 'All fields are compulsory',
        duration: 5000,
        position: 'topCenter',
      });
      return;
    }

    const formData = new FormData();
    formData.append('jsondata', JSON.stringify(this.ProductsForm.value));

    if (this.Image) {
      formData.append('Image', this.Image, this.Image.name);
    }

    this.service.updateproducts(formData, this.ProductsIdToUpdate).subscribe(
      (res) => {
        console.log(res);
        // Handle success
        this.toastService.success({
          detail: 'SUCCESS',
          summary: 'Product Updated Successfully ✔️',
          duration: 5000,
          position: 'topCenter',
        });
        this.ProductsForm.reset();
        this.router.navigate(['lms/ManageProducts']);
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

  fillFormToUpdate(ProductsResponse: any[] | products) {
    if (Array.isArray(ProductsResponse) && ProductsResponse.length > 0) {
      const ProductData = ProductsResponse[0];
      this.ProductsForm.patchValue({
        ProductID: ProductData.ProductID,
        ProductName: ProductData.ProductName,
        Description: ProductData.Description,
        Price: ProductData.Price,
      });

      // Handle the file separately
      if (ProductData.Image) {
        this.Image = ProductData.Image; // Assuming ProductData.Image is the file name string
        this.updateFileLabel(ProductData.Image); // Update the file label
      }

    } else if (!Array.isArray(ProductsResponse)) {
      console.log('Filling form with Lead:', ProductsResponse);
      this.ProductsForm.patchValue({
        ProductID: ProductsResponse.ProductID,
        ProductName: ProductsResponse.ProductName,
        Description: ProductsResponse.Description,
        Price: ProductsResponse.Price,
      });

      // Handle the file separately
      if (ProductsResponse.Image) {
        this.Image = ProductsResponse.Image; // Assuming ProductsResponse.Image is the file name string
        this.updateFileLabel(ProductsResponse.Image); // Update the file label
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