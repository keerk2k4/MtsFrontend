import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { HttpInterceptor } from './httpinterceptor';

import { App } from './app';
import { GetDetails } from './get-details/get-details';
import { GetBalance } from './get-balance/get-balance';
import { Accountinfo } from './accountinfo/accountinfo';
import { Login } from './login/login';
import { Transfer } from './transfer/transfer';
import { History } from './history/history';
import { RewardInfoComponent } from './reward-info/rewardinfo';       // ← ADD
import { RewardHistoryComponent } from './reward-history/rewardhistory'; // ← ADD

@NgModule({
  declarations: [
    App,
    GetDetails,
    GetBalance,
    Accountinfo,
    Login,
    Transfer,
    History,
    RewardInfoComponent,      // ← ADD (standalone:false so declare here)
    RewardHistoryComponent,   // ← ADD
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    RouterModule.forRoot([]),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([HttpInterceptor]),
    ),
  ],
  bootstrap: [App]
})
export class AppModule { }
