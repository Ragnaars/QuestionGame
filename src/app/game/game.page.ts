import { Component, OnInit } from '@angular/core';
import {ApiService} from "../service/api.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  //variables
  questions : any = [];
  questionTitle: any;
  questionAnswer: any;
  helpAnswer: any;
  questionNumber : any;
  formSendAnswer: FormGroup ;
  constructor(
    public formBuilder: FormBuilder,
    private serviceApi : ApiService,
    public alertController : AlertController
  ) { 
      this.formSendAnswer = this.formBuilder.group({
        answer : ["",Validators.required]
      })
    }

  ngOnInit() {
    this.getQuestions();
    this.questionNumber = 0;
  }

  getQuestions(){
    this.serviceApi.getQuestions().subscribe(
      (res : any ) =>{
        this.questions = res;
        this.questionTitle = this.questions[0].question;
        this.questionAnswer = this.questions[0].answer;
        this.helpAnswer = this.questions[0].help;
        console.log(this.questions);
      }, (err:any) =>{
        console.log("error : ",err)
      }
    );
  }

  sendAnswer(){
    let value = this.formSendAnswer.value;
    console.log("Respuesta Enviada",value)

    if(value.answer.toLowerCase() == this.questionAnswer.toLowerCase()){
      console.log("Respuesta Correcta");
      this.presentAlertCorrectAsnwer();
    }else{
      console.log("Respuesta incorrecta");
      this.presentAlertIncorrectAsnwer();
    }
  }


  async presentAlertCorrectAsnwer(){
    const alert = await this.alertController.create({
      header : "Respuesta correcta",
      message : "Vemamos que más sabes!",
      buttons : ["OK"] 
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  async presentAlertIncorrectAsnwer(){
    const alert = await this.alertController.create({
      header : "Respuesta incorrecta",
      message : "Vuelve a intentarlo, seguro puedes!",
      buttons : ["OK"] 
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }
}
