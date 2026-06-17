import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Transferrequest } from '../transferrequest';
import { Transferservice } from '../transferservice';
import { Transferresponse } from '../transferresponse';
import { ErrorResponse } from '../error-response';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transfer',
  standalone: false,
  templateUrl: './transfer.html',
  styleUrls: ['./transfer.css'],
})
export class Transfer implements OnInit {

  isSuccess: any = null;
  statusMessage: any = null;
  readonly MAX_AMOUNT = 100000;

  transferreq: Transferrequest = {
    fromId: 0,
    toId: 0,
    amount: 0,
  };

  transferresp: Transferresponse = {
    transactionId: '',
    status: '',
    message: '',
    debitedFrom: 0,
    creditedTo: 0,
    amount: 0,
  };

  constructor(
    private service: Transferservice,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.transferreq.fromId = Number(param.get('id'));
      this.cd.detectChanges();
    });
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private isInteger(value: any): boolean {
    return /^-?\d+$/.test(String(value).trim());
  }

  private isValidAmount(value: any): boolean {
    return /^\d+(\.\d{1,2})?$/.test(String(value).trim()) && Number(value) > 0;
  }

  private validate(): boolean {
    if (!this.transferreq.toId || String(this.transferreq.toId).trim() === '') {
      this.isSuccess = false;
      this.statusMessage = 'Please enter the recipient account ID.';
      return false;
    }
    if (!this.transferreq.amount || String(this.transferreq.amount).trim() === '') {
      this.isSuccess = false;
      this.statusMessage = 'Please enter the amount.';
      return false;
    }
    if (!this.isInteger(this.transferreq.toId) || Number(this.transferreq.toId) < 1) {
      this.isSuccess = false;
      this.statusMessage = 'Recipient account ID must be a valid number.';
      return false;
    }
    if (!this.isValidAmount(this.transferreq.amount)) {
      this.isSuccess = false;
      this.statusMessage = 'Amount must be a positive number (e.g. 500 or 500.50).';
      return false;
    }
    if (Number(this.transferreq.amount) > this.MAX_AMOUNT) {
      this.isSuccess = false;
      this.statusMessage = `Amount cannot exceed ₹${this.MAX_AMOUNT.toLocaleString()}.`;
      return false;
    }
    if (Number(this.transferreq.fromId) === Number(this.transferreq.toId)) {
      this.isSuccess = false;
      this.statusMessage = 'You cannot transfer to the same account.';
      return false;
    }
    return true;
  }

  transferMoney() {
    if (!this.validate()) {
      this.cd.detectChanges();
      return;
    }

    // Generate a unique idempotency key for each new transfer attempt
    this.transferreq.idempotencyKey = this.generateUUID();

    this.service.transferMoney(this.transferreq).subscribe({
      next: (resp: Transferresponse | ErrorResponse) => {
        if (resp && 'transactionId' in resp) {
          this.transferresp = resp as Transferresponse;
          this.isSuccess = true;
          this.statusMessage = `✅ Transfer successful! ₹${this.transferresp.amount.toLocaleString()} sent to Account #${this.transferresp.creditedTo}.`;
        } else {
          this.isSuccess = false;
          this.statusMessage = 'Transfer failed: ' + ((resp as ErrorResponse)?.message ?? '');
        }
        this.cd.detectChanges();
      },
      error: (err) => {
        this.isSuccess = false;
        this.statusMessage = 'Transfer failed: ' + (err?.error?.message ?? 'Unknown error. Please try again.');
        this.cd.detectChanges();
      },
    });
  }

  navigate(): void {
    this.router.navigate(['/home']);
  }
}
