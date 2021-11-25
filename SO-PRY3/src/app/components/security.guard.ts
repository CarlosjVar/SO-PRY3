import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SecurityGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate() {
    console.log('entra');
    let userActual = localStorage.getItem('username');
    if (userActual == null) {
      console.log('No se tiene permiso para acceder.');
      this.router.navigate(['/', "home"]);
      return false;
    }
    return true;
    
  }
}
