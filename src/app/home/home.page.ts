import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular'; 

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  constructor( public router : Router,
              public alertController : AlertController
      ) {}

  
  
  ngOnInit() {
  
  }
  
  isClicked: boolean = false;
  //animacion foto
  toggleAnimation() {
    this.isClicked = !this.isClicked;
  }

  start(){
    this.presentAlertStart();
    
  }

  continue(){
    this.router.navigate(["/game"]);
  }

  async presentAlertStart(){
    const alert = await this.alertController.create({
      header : "¿Deseas comenzar de 0?",
      message : "Perderás todo el progreso",
      buttons : [{
        text: "SI",
        handler : ()=>{
          localStorage.setItem("questionNumber","0");
          this.router.navigate(["/game"]);
        }
      },
      {
        text: "NO",
        handler : ()=>{
        }
      }]
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  insta(){
    window.open("https://www.instagram.com/ragnaarson/",'_system','location=yes')
  }

}
