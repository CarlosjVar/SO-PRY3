import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { createDirectory, Directory} from "../models/directories.model";
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class DirectoriesService {

  private URL: string = 'http://localhost:5000/';

  constructor(private http: HttpClient) { }

  
    /* New User */
  geDirectories(user:string){
    return this.http.get<any>(this.URL+'api/dirs/get?target_dir=&username='+user);
  }

  getInside(user:string,dir:string){
    return this.http.get<any>(this.URL+'api/dirs/get?target_dir='+dir+'&username='+user);
  }

  createDirectory(dir:createDirectory){
    //localhost:5000/api/dirs/create
    return this.http.post<any>(this.URL+'api/dirs/create',dir);
  }


}
