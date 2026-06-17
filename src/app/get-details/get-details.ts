import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Accountservice } from '../accountservice';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountResponse } from '../accountresponse';
import { ErrorResponse } from '../error-response';

@Component({
  selector: 'app-get-details',
  standalone: false,
  templateUrl: './get-details.html',
  styleUrl: './get-details.css',
})
export class GetDetails implements OnInit {

  errorMsg: string = '';

  accountresp: AccountResponse = {
    id: 0,
    holderName: '',
    balance: 0,
    status: '',
    version: 0,
    lastUpdated: new Date()
  };

  constructor(
    private service: Accountservice,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const id = Number(param.get('id'));
      this.getUserDetails(id);
    });
  }

  getUserDetails(id: number): void {
    this.service.getDetails(id).subscribe({
      next: (resp: AccountResponse | ErrorResponse) => {
        if ('id' in resp) {
          this.accountresp = resp as AccountResponse;
          this.errorMsg = '';
        } else {
          this.errorMsg = (resp as ErrorResponse).message || 'Failed to load account details.';
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Could not load account. Please try again.';
        this.cd.detectChanges();
      }
    });
  }

  navigate(): void {
    this.router.navigate(['/home']);
  }
}
