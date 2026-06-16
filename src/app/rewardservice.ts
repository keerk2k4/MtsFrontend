import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RewardPointsResponse {
  accountId: number;
  totalPoints: number;
  lastEarnedOn: string | null;
  updatedOn: string;
}

export interface RewardTransactionResponse {
  id: string;
  fromAccountId: number;
  toAccountId: number;
  transferAmount: number;
  pointsEarned: number;
  relatedTransactionId: string;
  createdOn: string;
}

@Injectable({
  providedIn: 'root'
})
export class RewardService {
  
  private baseUrl = 'http://localhost:8080/api/v1/rewards';

  constructor(private http: HttpClient) { }

  /**
   * Get reward points for an account
   * @param accountId The account ID
   * @returns Observable containing reward points
   */
  getRewardPoints(accountId: number): Observable<RewardPointsResponse> {
    return this.http.get<RewardPointsResponse>(`${this.baseUrl}/points/${accountId}`);
  }

  /**
   * Get reward transaction history for an account
   * @param accountId The account ID
   * @returns Observable containing list of reward transactions
   */
  getRewardHistory(accountId: number): Observable<RewardTransactionResponse[]> {
    return this.http.get<RewardTransactionResponse[]>(`${this.baseUrl}/history/${accountId}`);
  }

  /**
   * Initialize reward points for a new account
   * @param accountId The account ID
   * @returns Observable containing success message
   */
  initializeRewardPoints(accountId: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/initialize/${accountId}`, {});
  }
}
