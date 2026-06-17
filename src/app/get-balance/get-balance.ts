import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Accountservice } from '../accountservice';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-get-balance',
  standalone: false,
  templateUrl: './get-balance.html',
  styleUrls: ['./get-balance.css'],
})
export class GetBalance implements OnInit {
  balance: number = 0;
  errorMsg: string = '';

  constructor(
    private service: Accountservice,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const id = Number(param.get('id'));
      this.getUserBalance(id);
    });
  }

  getUserBalance(id: number): void {
    this.service.getBalance(id).subscribe({
      next: (resp: number) => {
        this.balance = resp;
        this.errorMsg = '';
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Could not load balance. Please try again.';
        this.cd.detectChanges();
      }
    });
  }

  navigate(): void {
    this.router.navigate(['/home']);
  }
}
