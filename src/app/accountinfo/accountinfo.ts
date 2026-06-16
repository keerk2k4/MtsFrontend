import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth } from '../auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-accountinfo',
  standalone: false,
  templateUrl: './accountinfo.html',
  styleUrl: './accountinfo.css',
})
export class Accountinfo {

  accountId: number | null = null;
  private isBrowser = false;

  constructor(
    private router: Router,
    private authService: Auth,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const storedId = sessionStorage.getItem('auth_account_id');
      if (storedId) this.accountId = Number(storedId);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}