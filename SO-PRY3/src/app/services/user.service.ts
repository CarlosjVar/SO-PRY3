import { Injectable } from '@angular/core';
import { UserLogin, User} from "../models/user.model";
import { HttpClient, } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private URL: string = 'http://localhost:5000/';

  constructor(private http: HttpClient) { }

    /* New User */
    signUp(user:User){
      return this.http.post<any>(this.URL+'api/users/signup', user);
    }
  
  
    logIn(user:UserLogin){
      return this.http.post<any>(this.URL+'/api/users/login', user);
    }

}
