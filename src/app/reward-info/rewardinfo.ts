import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RewardService, RewardPointsResponse } from '../rewardservice';

@Component({
  selector: 'app-reward-info',
  standalone: false,          // ← FIXED: was true, must match AppModule
  templateUrl: './rewardinfo.html',
  styleUrls: ['./rewardinfo.css']
})
export class RewardInfoComponent implements OnInit {

  accountId: number = 0;
  rewardPoints: RewardPointsResponse | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private rewardService: RewardService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.accountId = Number(params.get('id'));
      this.loadRewardPoints();
    });
  }

  loadRewardPoints(): void {
    this.loading = true;
    this.error = null;

    this.rewardService.getRewardPoints(this.accountId).subscribe({
      next: (data) => {
        this.rewardPoints = data;
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load reward points. Please try again.';
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  getLastEarnedDate(): string {
    if (!this.rewardPoints?.lastEarnedOn) return 'No transfers yet';
    return new Date(this.rewardPoints.lastEarnedOn).toLocaleString('en-IN');
  }

  navigate(): void {
    this.router.navigate(['/home']);
  }
}
