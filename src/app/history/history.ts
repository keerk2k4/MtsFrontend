import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Transactionlog } from '../transactionlog';
import { ActivatedRoute, Router } from '@angular/router';
import { Transferservice } from '../transferservice';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.html',
  styleUrl: './history.css',
})
export class History implements OnInit {

  transactions: Transactionlog[] = [];
  filteredTransactions: Transactionlog[] = [];
  currentAccountId: number = 0;
  activeFilter: string = 'all';
  errorMsg: string = '';

  constructor(
    private transferservice: Transferservice,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.currentAccountId = Number(param.get('id'));
      this.loadTransactions();
    });
  }

  loadTransactions(): void {
    this.transferservice.getTransactions(this.currentAccountId).subscribe({
      next: (transactions) => {
        this.transactions = transactions.sort((a, b) =>
          new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime()
        );
        this.filteredTransactions = [...this.transactions];
        this.errorMsg = '';
        this.cd.detectChanges();
      },
      error: (err) => {
        this.errorMsg = err?.error?.message || 'Could not load transactions. Please try again.';
        this.cd.detectChanges();
      }
    });
  }

  filterTransactions(type: string): void {
    this.activeFilter = type;
    if (type === 'all') {
      this.filteredTransactions = [...this.transactions];
    } else if (type === 'sent') {
      this.filteredTransactions = this.transactions.filter(
        t => t.fromAccountId === this.currentAccountId
      );
    } else if (type === 'received') {
      this.filteredTransactions = this.transactions.filter(
        t => t.toAccountId === this.currentAccountId
      );
    }
  }

  getOtherAccountId(tx: Transactionlog): number {
    return tx.fromAccountId === this.currentAccountId ? tx.toAccountId : tx.fromAccountId;
  }

  formatDate(dateString: string | Date): string {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
