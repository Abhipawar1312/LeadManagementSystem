import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NgConfirmService } from 'ng-confirm-box';
import { products } from 'src/app/models/products.model';
import { ProductsService } from 'src/app/service/products.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.css']
})
export class ManageProductsComponent implements OnInit {
  public dataSource!: MatTableDataSource<products>;
  public Products!: products[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = ['ProductID', 'ProductName', 'Description', 'Price', 'Image', 'Action'];
  constructor(private service: ProductsService, private router: Router, private ngConfirm: NgConfirmService, private toast: NgToastService, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.getproducts();
  }
  getproducts() {
    this.service.getproducts().subscribe({
      next: (res) => {
        this.Products = res;
        this.dataSource = new MatTableDataSource(this.Products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  edit(ProductID: number) {
    this.router.navigate(['lms/updateProducts', ProductID]);
  }

  delete(ProductID: number) {
    this.ngConfirm.showConfirm("Are you sure you want to delete?",
      () => {
        this.service.deleteproducts(ProductID).subscribe(
          res => {
            this.toast.success({ detail: 'SUCCESS', summary: 'Product Deleted successfully', duration: 3000, position: 'topCenter' });
            this.getproducts();
          },
          error => {
            console.error('Error deleting lead:', error);
            this.toast.error({ detail: 'Error', summary: 'Failed to delete lead', duration: 3000, position: 'topCenter' });
          }
        );
      },
      () => {
        this.toast.info({ detail: 'Cancelled', summary: 'Deletion cancelled', duration: 3000, position: 'topCenter' });
      }
    );
  }

  importFromExcel(event: any): void {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      // Assuming the data is in the first sheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Parse the sheet data into an array of objects
      const ProductsData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assuming the first row contains headers, so skipping it
      const headers: string[] = (ProductsData.shift() as string[]) || [];

      const parsedProducts = ProductsData.map((lead: any) => {
        const ProductObject: any = {};
        headers.forEach((header: string, index: number) => {
          ProductObject[header] = lead[index];
        });
        return ProductObject;
      });

      // Now 'parsedLeads' contains the imported data
      console.log(parsedProducts);

      // Update the data source and trigger change detection
      this.Products = parsedProducts;
      this.dataSource = new MatTableDataSource(this.Products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      // Trigger change detection
      this.cdr.detectChanges();
    };

    reader.readAsArrayBuffer(file);
  }

  exportToExcel(): void {
    const data = this.Products.map((Product) => {
      return {
        ProductID: Product.ProductID,
        ProductName: Product.ProductName,
        Description: Product.Description,
        Price: Product.Price,
        Image: Product.Image,
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    saveAs(blob, 'Products.xlsx');
  }
}
