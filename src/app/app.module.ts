import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokensService } from './tokens.service';
import { TokenComponent } from './token/token.component';
import { TokensComponent } from './tokens/tokens.component';
import { StarComponent } from './star/star.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchedComponent } from './watched/watched.component';

@NgModule({
  //add the components in the module:
  declarations: [
    AppComponent,
    TokenComponent,
    TokensComponent,
    StarComponent,
    PortfolioComponent,
    WatchedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    TokensService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
