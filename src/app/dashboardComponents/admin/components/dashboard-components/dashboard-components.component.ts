import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-dashboard-components',
  templateUrl: './dashboard-components.component.html',
  styleUrls: ['./dashboard-components.component.css']
})
export class DashboardComponentsComponent implements OnInit {
  constructor(private auth: AuthService, private route: Router) { }

  ngOnInit(): void {
    // Include your JavaScript script here
    this.loadScript('./assets/js/jquery.min.js');
    this.loadScript('./assets/js/bootstrap.bundle.min.js');
    this.loadScript('./assets/js/script.js');
  }

  private loadScript(scriptUrl: string): void {
    const script = document.createElement('script');
    script.src = scriptUrl;
    document.body.appendChild(script);
  }

  logout() {
    sessionStorage.removeItem("isLoginUser");
    this.route.navigate(["login"]);
    // this.auth.logout();
  }
}
