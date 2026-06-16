import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';                         // ← ADD
import { RewardService, RewardPointsResponse } from '../rewardservice';

@Component({
  selector: 'app-reward-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rewardinfo.html',
  styleUrls: ['./rewardinfo.css']
})
export class RewardInfoComponent implements OnInit {
  @Input() accountId: number | null = null;
  
  rewardPoints: RewardPointsResponse | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private rewardService: RewardService, private route: ActivatedRoute) {}  // ← ADD route

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {        // ← REPLACE entire block
    this.accountId = Number(params.get('id'));
    this.loadRewardPoints();
  });
}

  loadRewardPoints(): void {
    if (!this.accountId) {
      return;
    }

    this.loading = true;
    this.error = null;

    this.rewardService.getRewardPoints(this.accountId).subscribe({
      next: (data) => {
        this.rewardPoints = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reward points:', err);
        this.error = 'Failed to load reward points';
        this.loading = false;
      }
    });
  }

  getLastEarnedDate(): string {
    if (!this.rewardPoints?.lastEarnedOn) {
      return 'N/A';
    }
    return new Date(this.rewardPoints.lastEarnedOn).toLocaleDateString();
  }

  refresh(): void {
    this.loadRewardPoints();
  }
}
