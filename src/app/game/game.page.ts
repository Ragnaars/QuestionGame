import { Component, OnInit } from '@angular/core';
import {ApiService} from "../service/api.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import {Router} from '@angular/router'; 

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
  frases: any = [];
  questionLength: any;
  constructor(
    public router : Router,
    public formBuilder: FormBuilder,
    private serviceApi : ApiService,
    public alertController : AlertController
  ) { 
      this.formSendAnswer = this.formBuilder.group({
        answer : ["",Validators.required]
      })
    }

  ngOnInit() {
  
  }

  ionViewWillEnter() {
    this.questionNumber = localStorage.getItem('questionNumber');
    if(!this.questionNumber){
      this.questionNumber = 0;
    }
    this.getQuestions();
    this.getFrases();
  }


  getQuestions(){
    this.serviceApi.getQuestions().subscribe(
      (res : any ) =>{
        this.questions = res;
        this.questionLength = this.questions.length -1;
        console.log("Cantidad de preguntas : ", this.questionLength)
        this.questionTitle = this.questions[this.questionNumber].question;
        this.questionAnswer = this.questions[this.questionNumber].answer;
        this.helpAnswer = this.questions[this.questionNumber].help;
        console.log(this.questions);
        if(!this.questionTitle){
          this.presentAlertWin();
        }
      }, (err:any) =>{
        console.log("error : ",err)
      }
    );
  }

  async presentAlertWin(){
    const alert = await this.alertController.create({
      header : "Eres un genio!",
      message : "lograste finalizar el juego a como dio lugar",
      buttons : ["Gracias"] 
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  getFrases(){
    this.serviceApi.getFrases().subscribe(
      (res : any ) =>{
        this.frases = res;
        console.log("frases : " ,this.questions);
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
    this.next();
  }

  async presentAlertIncorrectAsnwer(){
    const alert = await this.alertController.create({
      header : "Respuesta incorrecta",
      message : this.frases[this.getRandomInt(0,11)].answer,
      buttons : ["OK"] 
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  getRandomInt(min : any ,max : any){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
  }

  async presentAlertHelp(){
    const alert = await this.alertController.create({
      header : "Pista",
      message : this.helpAnswer,
      buttons : ["OK"] 
    });
    await alert.present();
    let result = await alert.onDidDismiss();
  }

  next(){
    if(this.questionNumber < this.questionLength){
      this.questionNumber = ++this.questionNumber;
      localStorage.setItem("questionNumber",this.questionNumber)
      this.getQuestions();
    }else{
      this.presentAlertWin();
      this.router.navigate(["/home"]);
    }
    
    
  }

  help(){
    this.presentAlertHelp();
  }
}
