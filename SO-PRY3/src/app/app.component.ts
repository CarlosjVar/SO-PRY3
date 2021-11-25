import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'SO-PRY3';

  
  constructor(private router: Router){
  }

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
