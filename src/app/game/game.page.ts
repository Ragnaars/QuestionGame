import { Component, OnInit } from '@angular/core';
import {ApiService} from "../service/api.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  //variables
  questions : any = [];
  constructor(
    private serviceApi : ApiService
  ) { }

  ngOnInit() {
    this.getQuestions();
  }

  getQuestions(){
    this.serviceApi.getQuestions().subscribe(
      (res : any ) =>{
        this.questions = res;
        console.log(this.questions);
      }, (err:any) =>{
        console.log("error : ",err)
      }
    );
  }
}
