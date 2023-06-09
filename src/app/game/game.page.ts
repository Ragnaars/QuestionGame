import { Component, OnInit } from '@angular/core';
import {ApiService} from "../service/api.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import {Router} from '@angular/router'; 
import { AdMob, AdOptions, BannerAdOptions, BannerAdSize, BannerAdPosition, BannerAdPluginEvents, AdMobBannerSize } from '@capacitor-community/admob';
import { ItemReorderEventDetail } from '@ionic/angular';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  //variables
  questions : any = [];
  questionTitle: any;
  questionAnswer: any ;
  helpAnswer: any;
  questionNumber : any;
  formSendAnswer: FormGroup ;
  frases: any = [];
  questionLength: any;
  scoreTotal : any = 0;
  score: any = 0;
  lives: number = 3;
  livesArray: number[] = [];
  random: any;
  options :any = [];

  constructor(
    public router : Router,
    public formBuilder: FormBuilder,
    private serviceApi : ApiService,
    public alertController : AlertController
  ) { 
      this.lives = 3;
      this.generateLivesArray();
      this.formSendAnswer = this.formBuilder.group({
        answer : ["",Validators.required]
      })
    }

    handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
      // The `from` and `to` properties contain the index of the item
      // when the drag started and ended, respectively
      console.log('Dragged from index', ev.detail.from, 'to', ev.detail.to);
  
      // Finish the reorder and position the item in the DOM based on
      // where the gesture ended. This method can also be called directly
      // by the reorder group
      ev.detail.complete();
    }

    generateLivesArray() {
      this.livesArray = Array(this.lives).fill(0);
    }
    increaseLife() {
      if (this.lives < 5) {
        this.lives++;
        this.generateLivesArray();
      } else {
        this.lives = 5;
      }
    }

    
  ngOnInit() {
  
    AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: ['ff8c0041-084f-4030-90cf-47ef7619743a'],
      initializeForTesting: true,
    });
    this.showBanner();
  }

  ionViewWillEnter() {
    this.questionNumber = localStorage.getItem('questionNumber');
    this.scoreTotal = localStorage.getItem('score');
    if(!this.questionNumber && this.scoreTotal){
      this.questionNumber = 0;
      this.scoreTotal = 0;
    }
    
  const storedLives = localStorage.getItem('lives');
  if (storedLives) {
    this.lives = parseInt(storedLives, 10);
  } else {
    this.lives = 3;
  }

  this.generateLivesArray();
    this.getQuestions();
    this.getFrases();
  }


  getQuestions(){
    this.serviceApi.getQuestions().subscribe(
      (res : any ) =>{
        this.questions = res;
        this.questionLength = this.questions.length -1;
        this.random = this.getRandomInt(0,this.questionLength);
        console.log("Cantidad de preguntas : ", this.questionLength)
        this.questionTitle = this.questions[this.random].question;
        this.questionAnswer = this.questions[this.random].answer;
        this.helpAnswer = this.questions[this.random].help;
        this.score = this.questions[this.random].score;
        this.options = this.questions[this.random].options;
        
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
    if(this.omitirTildes(value.answer.toLowerCase()) == this.omitirTildes(this.questionAnswer.toLowerCase())){
      console.log("Respuesta Correcta");
      this.formSendAnswer.reset();
      this.increaseLife();
      this.scoreTotal = Number(this.scoreTotal) + Number(this.score);
      localStorage.setItem('score',this.scoreTotal);
      this.presentAlertCorrectAsnwer();
      ;
    }else{
      console.log("Respuesta incorrecta");
      this.formSendAnswer.reset();
      this.lives--;
      this.generateLivesArray();
      if (this.lives === 0) {
        // Realizar alguna acción cuando se queden sin vidas
        console.log('Se quedó sin vidas');
        
        this.router.navigate(['/home'])
        localStorage.setItem('questionNumber',"0");
        
      }
      this.presentAlertIncorrectAsnwer();
    }
  }
  async presentAlertWithoutLives(){
    const alert = await this.alertController.create({
      header : "Vuelve a intentarlo",
      message : "Se te han acabado las vidas",
      buttons : ["Reintentar"] 
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    this.next();
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
  omitirTildes(texto: string): string {
    const tildes: { [key: string]: string } = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      Á: 'A',
      É: 'E',
      Í: 'I',
      Ó: 'O',
      Ú: 'U'
    };
  
    return texto.replace(/[áéíóúÁÉÍÓÚ]/g, (match) => tildes[match]);
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
      this.questions.splice(this.random);
      this.getQuestions();
    }else{
      this.presentAlertWin();
      this.router.navigate(["/home"]);
    }
    
    
  }

  async showAdsInterstitial(){
    const options: AdOptions ={
      adId : "ca-app-pub-8865078809185990/7060238262",
      isTesting : true,
    };
    await AdMob.prepareInterstitial(options);
    await AdMob.showInterstitial();
  }

  async showBanner(){
    const options : BannerAdOptions ={
      adId : "ca-app-pub-8865078809185990/8201929547",
      isTesting : true,
      adSize : BannerAdSize.ADAPTIVE_BANNER,
      position : BannerAdPosition.TOP_CENTER,
      margin : 0,
    };
    await AdMob.showBanner(options);
    await AdMob.showInterstitial();
  }

  help(){
    this.presentAlertHelp();
    this.showAdsInterstitial();
  }
}
