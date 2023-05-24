import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor( public router : Router) {}

  
  
  ngOnInit() {
  
  }
  
  isClicked: boolean = false;
  //animacion foto
  toggleAnimation() {
    this.isClicked = !this.isClicked;
  }

  start(){
    this.router.navigate(["/game"]);
  }

}
