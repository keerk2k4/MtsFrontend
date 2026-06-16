import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Account } from './account';
import { ErrorResponse } from './error-response';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Transferrequest } from './transferrequest';
import { AccountResponse} from './accountresponse';
import { Transferresponse } from './transferresponse';

@Injectable({
  providedIn: 'root',
})

export class Accountservice {
  URI = 'http://localhost:8080/api/v1/account';

  constructor(private http: HttpClient) {}

  getDetails(id: number): Observable<AccountResponse|ErrorResponse>{
    return this.http.get<AccountResponse|ErrorResponse>(this.URI+`/${id}`);
  }
  
  getBalance(id: number): Observable<number> {
      return this.http.get<number>(`${this.URI}/${id}/balance`)
  }

}