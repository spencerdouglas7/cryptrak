import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';    
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokensService } from './tokens.service';
import { TokenComponent } from './token/token.component';
import { TokensComponent } from './tokens/tokens.component';
import { StarComponent } from './star/star.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { WatchedComponent } from './watched/watched.component';
import { UsersService } from './users.service';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { WatchedService } from './watched.service';
import { PortfolioService } from './portfolio.service';

@NgModule({
  //add the components in the module:
  declarations: [
    AppComponent,
    TokenComponent,
    TokensComponent,
    StarComponent,
    PortfolioComponent,
    WatchedComponent,
    AuthComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    TokensService,
    UsersService,
    WatchedService,
    PortfolioService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
