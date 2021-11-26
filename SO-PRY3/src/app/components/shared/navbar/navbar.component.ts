import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username :string | null= "";
  constructor( private router: Router ) { 
  }

  ngOnInit(): void {
  }

  hasRoute(route: string) {
    this.username = localStorage.getItem("username");
    return this.router.url.includes(route);
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/', 'home']); 
  }

}
