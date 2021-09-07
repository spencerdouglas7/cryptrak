import { Component } from '@angular/core';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cryptrak';
  constructor(private usersService: UsersService) {}

  userAuthenticated(): boolean {
    return this.usersService.userAuthenticated;
  }
  ngOnInit() {
  
  }
}




