import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../services/globals.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private glb: GlobalsService) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.glb.isMainPage = false;
  }
}
