import { Component, OnInit } from '@angular/core';
import { User } from "../../models/user.model";
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  username: string = "";
  password: string = "";
  d_size: any = 0 ;
  d_name: string = "";
  newUser:User | undefined;

  constructor(private _userService: UserService, 
    private router: Router) { 
    document.body.style.backgroundImage = 'url("../../../assets/img/login-bg.png")';
  }


  ngOnInit(): void {
  }

  sendData(userSignUpForm: { form: { value: { username: string; password: string; d_size: number; d_name: string; }; }; }): void{
    this.username = userSignUpForm.form.value.username;
    this.password = userSignUpForm.form.value.password;
    this.d_size = userSignUpForm.form.value.d_size;
    this.d_name = userSignUpForm.form.value.d_name;

    /* Lo enviamos al servidor de BD */
    this.newUser = {username: this.username, password: this.password, size: this.d_size, drive_name:this.d_name};
 
    this._userService.signUp(this.newUser).subscribe({
      complete: () => { localStorage.setItem('username', this.username);
      this.router.navigate(['/', 'my-drive']);  }, // completeHandler
      error: () => { console.log("error") },    // errorHandler 
    })
    /*this.toastr.error('Creación de cuenta inválida, corrobore los datos ingresados', 'ERROR')*/
     
  }

}
