import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RewardService, RewardTransactionResponse } from '../rewardservice';

@Component({
  selector: 'app-reward-history',
  standalone: false,          // ← FIXED: was true, must match AppModule
  templateUrl: './rewardhistory.html',
  styleUrls: ['./rewardhistory.css']
})
export class RewardHistoryComponent implements OnInit {

  accountId: number = 0;
  rewardTransactions: RewardTransactionResponse[] = [];
  loading: boolean = true;
  error: string | null = null;
  displayCount: number = 5;

  constructor(
    private rewardService: RewardService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.accountId = Number(params.get('id'));
      this.loadRewardHistory();
    });
  }

  loadRewardHistory(): void {
    this.loading = true;
    this.error = null;

    this.rewardService.getRewardHistory(this.accountId).subscribe({
      next: (data) => {
        this.rewardTransactions = data || [];
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load reward history. Please try again.';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  getVisibleTransactions(): RewardTransactionResponse[] {
    return this.rewardTransactions.slice(0, this.displayCount);
  }

  getTotalPoints(): number {
    return this.rewardTransactions.reduce((sum, t) => sum + t.pointsEarned, 0);
  }

  showMore(): void { this.displayCount += 5; }
  showLess(): void { this.displayCount = 5; }
  hasMore(): boolean { return this.rewardTransactions.length > this.displayCount; }

  formatDate(d: string): string {
    return new Date(d).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  navigate(): void {
    this.router.navigate(['/home']);
  }
}
