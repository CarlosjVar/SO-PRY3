import { Component, OnInit } from '@angular/core';
import { UserLogin } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  password: string = '';
  username: string = '';
  newUser: UserLogin | undefined;

  constructor(private _userService: UserService, private router: Router) {
    document.body.style.backgroundImage =
      'url("../../../assets/img/login-bg.png")';
  }

  ngOnInit(): void {}

  sendData(userLoginForm: {
    form: { value: { username: string; password: string } };
  }): void {
    this.username = userLoginForm.form.value.username;
    this.password = userLoginForm.form.value.password;

    console.log(this.username);
    console.log(this.password);

    this.newUser = { username: this.username, password: this.password, max_drive_size:0 };
    this._userService.logIn(this.newUser).subscribe({
      next: (user: UserLogin) => {
        localStorage.setItem('username', user.username);
        this.router.navigate(['/', 'my-drive']);
        console.log(user);
      }, // completeHandler
      error: (errors: Error) => {
        console.log(errors);
      }, // errorHandler
    });
  }
  
  logout() {
    this.router.navigate(['/', 'my-drive']);
  }
}
