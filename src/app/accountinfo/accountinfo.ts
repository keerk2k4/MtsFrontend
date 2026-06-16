import { Component } from '@angular/core';
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


  
  constructor(private router: Router, private authService: Auth) {}

  ngOnInit(): void {
  const storedId = sessionStorage.getItem('auth_account_id');  // ← CHANGE KEY
  if (storedId) {
    this.accountId = Number(storedId);
  }
}

}
logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
}