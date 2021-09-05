import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { UsersService } from '../users.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() didSwitchView: EventEmitter<any> = new EventEmitter();
  
  switchView() {
      this.didSwitchView.emit('login');
  }
  username: string = "";
  password: string = "";
  errors: string = "";
  constructor(private usersService: UsersService) { 
    
  }

  register(email: string, password: string) {
    this.errors = "";
    if (!email.length) {
      this.errors += "Your username is invalid.\n"
    }
    if (password.length < 8) {
      this.errors += "Your password must be at least 8 characters.\n"
    }
    if (this.errors.length) {
      console.log(this.errors);
    }
    this.usersService.registerUser(email, password);
  }

  ngOnInit(): void {
  }

}
