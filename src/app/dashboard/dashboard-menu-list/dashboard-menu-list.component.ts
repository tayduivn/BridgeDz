import { Component, OnInit } from '@angular/core';
import { GlobalsService } from 'src/app/services/globals.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { DbinteractionsService } from 'src/app/services/dbinteractions.service';


@Component({
  selector: 'app-dashboard-menu-list',
  templateUrl: './dashboard-menu-list.component.html',
  styleUrls: ['./dashboard-menu-list.component.scss'],
})
export class DashboardMenuListComponent implements OnInit {

  constructor(
    private glb: GlobalsService,
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    private db: DbinteractionsService,
    private authser: LoginService) {

  }
  logout() {
    this.dissmisPopover();
    this.db.setStorage('accloggedin' , false);
    this.glb.AgencyLogData.loggedin = false;
    this.router.navigate(['client']);
  }
  dissmisPopover() {
    this.glb.popover.dismiss();
  }

  ngOnInit() {}

}