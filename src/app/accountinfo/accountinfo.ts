import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accountinfo',
  standalone: false,
  templateUrl: './accountinfo.html',
  styleUrl: './accountinfo.css',
})
export class Accountinfo implements OnInit {

  accountId: string | null = null;
  username: string = '';

  constructor(
    private router: Router,
    private authService: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.accountId = this.authService.getAccountId();
      this.username  = this.authService.getLoggedinUser();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}
