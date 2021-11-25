import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { itemsToDelete, toDelete, toMove, toShare } from '../models/shared.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  private URL: string = 'http://localhost:5000/';

  constructor(private http: HttpClient) { }

    delete(data:itemsToDelete){
      return this.http.post<any>(this.URL+'api/dirs/delete', data);
    }
    
    move(data:toMove){
      /*localhost:5000/api/dir/move */
      return this.http.post<any>(this.URL+'api/dir/move', data);
    }

    share(data:toShare){
      /*localhost:5000/api/dir/move */
      return this.http.post<any>(this.URL+'api/dir/share', data);
    }
}
