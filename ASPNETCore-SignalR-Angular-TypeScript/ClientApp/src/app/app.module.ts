import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { StockComponent } from './stock/stock.component';
import { DynamicHubComponent } from './DynamicHub/dynamichub.component';
import { LoginComponent } from './login/login.component';

import { SignalRService } from './services/signalR.service';
import { stockSignalRService } from './services/stock.signalR.service';
import { DynamicHubSignalRService } from './services/dynamicHub.signalR.service';
import { StorageServiceModule } from 'angular-webstorage-service';
import { WelcomeComponent } from './home/welcome.component';
//import { AngularFontAwesomeModule } from 'angular-font-awesome';


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    StockComponent,
    DynamicHubComponent,
    LoginComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    StorageServiceModule,

    RouterModule.forRoot([
      { path: '', component: LoginComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'stock-data', component: StockComponent },
      { path: 'dynamic', component: DynamicHubComponent },
      { path: 'user/:id/:connid', component: HomeComponent },
      { path: 'welcome', component: WelcomeComponent },
    ]),
    //AngularFontAwesomeModule,
  ],
  providers: [SignalRService,stockSignalRService,DynamicHubSignalRService],
  bootstrap: [AppComponent]
})
export class AppModule { }
