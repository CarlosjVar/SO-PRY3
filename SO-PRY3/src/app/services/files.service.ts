import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { createFile_, modifyFile_ } from '../models/File.model';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  private URL: string = 'http://localhost:5000/';

  constructor(private http: HttpClient) { }

  createFile(FILE:createFile_){
    //localhost:5000/api/file/create
    return this.http.post<any>(this.URL+'api/file/create',FILE);
  }

  modifyFile(FILE:modifyFile_){
    return this.http.post<any>(this.URL+'api/file/modify',FILE);
  }
}
