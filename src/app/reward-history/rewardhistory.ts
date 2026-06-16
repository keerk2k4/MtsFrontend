import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RewardService, RewardTransactionResponse } from '../rewardservice';

@Component({
  selector: 'app-reward-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rewardhistory.html',
  styleUrls: ['./rewardhistory.css']
})
export class RewardHistoryComponent implements OnInit {
  @Input() accountId: number | null = null;
  
  rewardTransactions: RewardTransactionResponse[] = [];
  loading: boolean = false;
  error: string | null = null;
  displayCount: number = 5; // Show first 5 by default

  constructor(private rewardService: RewardService) {}

  ngOnInit(): void {
    if (this.accountId) {
      this.loadRewardHistory();
    }
  }

  loadRewardHistory(): void {
    if (!this.accountId) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.rewardService.getRewardHistory(this.accountId).subscribe({
      next: (data) => {
        this.rewardTransactions = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reward history:', err);
        this.error = 'Failed to load reward history';
        this.loading = false;
      }
    });
  }

  getVisibleTransactions(): RewardTransactionResponse[] {
    return this.rewardTransactions.slice(0, this.displayCount);
  }

  getTotalVisiblePoints(): number {
    return this.getVisibleTransactions()
      .reduce((sum, t) => sum + t.pointsEarned, 0);
  }

  showMore(): void {
    this.displayCount += 5;
  }

  showLess(): void {
    this.displayCount = 5;
  }

  hasMore(): boolean {
    return this.rewardTransactions.length > this.displayCount;
  }

  refresh(): void {
    this.loadRewardHistory();
  }

  getEarningPercentage(transaction: RewardTransactionResponse): number {
    // Calculate how many ₹100 units are in the transfer amount
    return transaction.pointsEarned * 100;
  }
}
