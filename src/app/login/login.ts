import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../auth';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  username: string = '';
  password: string = '';
  accountId: string = '';   
  isLoggedin = false;
  error: string = '';
  data: any = {};

  private isBrowser = false;

  constructor(private router: Router, private authService: Auth, @Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  doLogin() {
  if (this.username !== '' && this.password !== '' && this.accountId !== '') {
    this.authService.authenticate(this.username, this.password).subscribe({
      next: () => {
        if (this.isBrowser) {
          sessionStorage.setItem('auth_account_id', this.accountId);
        }
        this.router.navigate(['/home']);
},
      error: (error) => {
        console.error("Login failed: ", error);
        this.error = 'Invalid credentials or error during login';
      }
    });
  } 
  else {
    window.alert("Please enter both username and password.");
  }
}
}
