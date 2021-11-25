import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  constructor() {
    document.body.style.backgroundImage = 'url("../../../assets/img/Sistemas Operativos.gif")';
  }

  ngOnInit(): void {
  }

}
