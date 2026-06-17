import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transferrequest } from './transferrequest';
import { Transferresponse } from './transferresponse';
import { Observable } from 'rxjs/internal/Observable';
import { ErrorResponse } from './error-response';
import { Transactionlog } from './transactionlog';

@Injectable({
  providedIn: 'root',
})
export class Transferservice {

  // Fixed URL to match backend: POST /api/v1/transfers
  URI1 = 'http://localhost:8080/api/v1/transfers';

  constructor(private http: HttpClient) {}

  transferMoney(transferreq: Transferrequest): Observable<Transferresponse | ErrorResponse> {
    return this.http.post<Transferresponse | ErrorResponse>(this.URI1, transferreq);
  }

  // Fixed URL: GET /api/v1/transfers/{id}/transactions
  getTransactions(accountId: number): Observable<Transactionlog[]> {
    return this.http.get<Transactionlog[]>(`${this.URI1}/${accountId}/transactions`);
  }
}
