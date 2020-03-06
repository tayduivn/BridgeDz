import { Injectable } from '@angular/core';
import { GlobalsService } from './globals.service';
import { LoginService } from './login.service';
import { LoadingService } from './loading.service';
import { HttpClient , HttpErrorResponse , HttpParams, HttpEventType } from '@angular/common/http';
import { AlertService } from './alert.service';
import { Httpresponse } from '../interfaces/httpresponse';
import { UserData } from '../interfaces/user-data';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DbinteractionsService {
  public uploadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public downloadProgress: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  constructor(
    private glb: GlobalsService,
    private http: HttpClient,
    private logserv: LoginService,
    private loading: LoadingService,
    private alertt: AlertService) {}

    setStorage(key , value) {
      this.logserv.setLocalstorage(key , value);
    }

    async reloadEvents(idcar) {
      const httpparams = new HttpParams().append('request' , 'loadEvents')
      .append('idcar' , idcar);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async updateAvail(data , idcar) {
      let str = '';
      let i = 0;
      data.forEach(element => {
        str += element.startTime.getFullYear() + '/' + ( element.startTime.getMonth() + 1) + '/' + (element.startTime.getDate() - 1) ;
        i += 1;
        if (i !== data.length) {
          str += ',';
        }
      });

      const httpparams = new HttpParams().append('request' , 'updateAvail')
      .append('string' , str).append('idcar' , idcar);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async answerDemand(answer , dmID) {
      console.log(answer + ' ----- ' + dmID);
      const httpparams = new HttpParams().append('request' , 'answerDemande')
      .append('value' , answer).append('demandID' , dmID);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        if (resp['status'] === 'success') {
          this.glb.AgencyLogData.DemandesCount = resp['data'].length;
        }
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }
    
    async fetchDemands(agId) {
      const httpparams = new HttpParams().append('request' , 'fetchDemandes')
      .append('agency' , agId);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        if (resp['status'] === 'success') {
          let counter = 0;
          resp['data'].forEach(element => {
            if (element['isread'] === '0') {
              counter += 1;
            }
          });
          this.glb.AgencyLogData.DemandesCount = counter;
        }
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });

    }

    async reserveCar(req) {
      const httpparams = new HttpParams().append('request' , 'bookCar')
      .append('iduser' , req.idClient).append('startdate' , req.startdate)
      .append('enddate' , req.enddate).append('idCar' , req.idCar)
      .append('totalPrice' , req.totalprice).append('needConfirm' , req.car['needConfirm']);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
        console.log(resp);
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    generateOptionsList(data) {
      let res = '';
      res += data.clim ? '1' : '_'; res += ',';
      res += data.rv ? '1' : '_'; res += ',';
      res += data.gps ? '1' : '_'; res += ',';
      res += data.sb ? '1' : '_'; res += ',';
      res += data.lc ? '1' : '_'; res += ',_';
      return res;
    }

    async fetchSearchreq(req) {

      const httpparams = new HttpParams().append('request' , 'fetchsearchreq')
      .append('offset' , req.offset).append('startdate' , req.startdate)
      .append('enddate' , req.enddate).append('starttime' , req.starttime)
      .append('endtime' , req.endtime).append('moteur' , req.filter.moteur)
      .append('pricemin' , req.filter.price.lower).append('pricemax' , req.filter.price.upper)
      .append('options' , this.generateOptionsList(req.filter))
      .append('daysdif' , req.daysdif);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
        console.log(resp);
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async updateAccessH(data: {alldays: string, startdate: string, enddate: string, starttime: string, endtime: string}): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'updateAccessH')
      .append('agencyid' , this.glb.AgencyLogData.id)
      .append('alldays' , data.alldays)
      .append('startdate' , data.startdate)
      .append('enddate' , data.enddate)
      .append('starttime' , data.starttime)
      .append('endtime' , data.endtime);
      this.loading.presentLoading();
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        this.loading.dismissLoading();
        return resp;
      }).catch(err => {
        this.loading.dismissLoading();
        console.log(err);
        return false;
      });
    }



    async delBR(id): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'delbonreduction').append('id' , id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        if (resp && resp.message === 'Success') {
          return true;
        } else {
          return false;
        }
      }).catch(err => {
        console.error(err);
        return false;
      });

    }


    async fetchBR(id): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'fetchbonreduction')
      .append('offset' , '0').append('agencyid' , id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async addBR(request: string , data: any): Promise<any> {
      let id = '0';
      if (request === 'update') {
        id = data.id;
      }
      const httpparams = new HttpParams().append('request' , 'addbonreduction')
      .append('for' , request).append('id' , id + '').append('agencyid' , this.glb.AgencyLogData.id)
      .append('name' , data.name).append('value' , data.value)
      .append('type' , data.type).append('code' , data.code)
      .append('dated' , data.debut).append('datef' , data.fin).append('status' , data.status);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async fetchCars(id: string): Promise<any> {
      console.log(id);
      const httpparams = new HttpParams().append('request' , 'fetchCars').append('agencyid' , id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    getStorage(key) {
      return this.logserv.getStorage(key);
    }
    async uploadLicence(file: any): Promise<any> {
      return await this.http.post(this.glb.hostServer + 'uploadLicense.php',  file).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }
    countNotifs(notifs: any) {
      let unread = 0;
      let notifications = [];
      notifs.forEach(element => {
        let notification = {};
        if (element['read_stat'] === '0') {
          unread += 1;
        }
        notification['id'] = element['id'];
        notification['title'] = element['title'];
        notification['desc'] = element['message'];
        notification['read'] = this.isRead(element['read_stat']);
        notification['icon'] = notification['read'] ? 'checkmark-circle' : 'radio-button-off';
        notifications.push(notification);
      });
      this.glb.notifications = notifications;
      this.glb.unreadNotif = unread;
    }
    async setRead(id: number) {
      const httpparams = new HttpParams()
      .append('request' , 'setNotiRead').append('id' , this.glb.notifications[id]['id']);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php',  httpparams ).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }
    isRead(val: string) {
      return val === '1' ? true : false;
    }
    async fetchNotifications(type: string) {
      const httpparams = new HttpParams()
      .append('request' , 'fetchNotifications').append('id' , this.glb.user.id).append('type' , type);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php',  httpparams ).toPromise().then( resp => {
        this.countNotifs(resp.data);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    pushNotification() {

    }

    async dbconfirmAddCar(data: any): Promise<boolean> {
      const httpparams = new HttpParams()
      .append('request' , 'addCar').append('id' , this.glb.user.id)
      .append('brand' , data[0].marque[0]).append('model' , data[0].modele[0])
      .append('engine' , data.bemail).append('cpays' , data.cpays)
      .append('bmobile' , data.bmobile).append('address' , data.address);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        if (resp.status === 'success') {
          this.glb.hasAgency = true;
          this.glb.AgencyLogData.loggedin = true;
          this.glb.AgencyLogData.id = resp.data;
          this.glb.AgencyLogData.bemail = data.bemail;
          this.glb.AgencyLogData.name = data.nom;
          this.glb.AgencyLogData.data = resp.data;
          return true;
        } else {
          return false;
        }
      }).catch(err => {
        console.error(err);
        return false;
      });
    }
    async dbcreateAgency(data: any): Promise<boolean> {
      const httpparams = new HttpParams()
      .append('request' , 'createAgency').append('id' , this.glb.user.id)
      .append('nom' , data.nom).append('cdate' , data.cdate)
      .append('bemail' , data.bemail).append('cpays' , data.cpays)
      .append('bmobile' , data.bmobile).append('address' , data.address);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        if (resp.status === 'success') {
          this.glb.hasAgency = true;
          this.glb.AgencyLogData.loggedin = true;
          this.glb.AgencyLogData.id = resp.data;
          this.glb.AgencyLogData.bemail = data.bemail;
          this.glb.AgencyLogData.name = data.nom;
          this.glb.AgencyLogData.data = resp.data;
          return true;
        } else {
          return false;
        }
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async FetchAcc(): Promise<any> {
      const httpparams = new HttpParams()
      .append('request' , 'fetchAgency').append('id' , this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async setAccParams(params: any) {
      console.log('second step');
      const httpparams = new HttpParams()
      .append('request' , 'setParams').append('id' , this.glb.user.id)
      .append('demandlocation' , params.demandlocation).append('redemandlocation' , params.redemandlocation)
      .append('locAccept' , params.locAccept).append('loccancel' , params.loccancel)
      .append('locrappel' , params.locrappel).append('emailpromo' , params.emailpromo);
      return await this.http.post(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async getAccParams(): Promise<any> {
      const httpparams = new HttpParams().append('request' , 'getParams').append('id' , this.glb.user.id);
      return await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php', httpparams).toPromise().then( resp => {
        console.log(resp);
        return resp.data;
      }).catch(err => {
        console.error(err);
        this.loading.dismissLoading();
        return false;
      });
    }

    convertToBool(val: string) {
      if (val === '1') {
        return true;
      } else {
        return false;
      }
    }


    async finishVerifyAcc(data: any , pics: any) {
      const httpparams = new HttpParams()
      .append('request' , 'verifyAcc')
      .append('id' , this.glb.user.id )
      .append('Lid' , data.lid)
      .append('dateo' , data.dateo)
      .append('payso' , data.payso)
      .append('imgrecto' , this.glb.hostServer + pics.rectoimg)
      .append('imgverso' , this.glb.hostServer + pics.versoimg);
      return await this.http.post(this.glb.hostServer + 'core.php',  httpparams).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      });
    }

    async uploadProfilePic(formdata: any): Promise<any> {
      return await this.http.post(this.glb.hostServer + 'uploadProfilePicture.php',  formdata).toPromise().then( resp => {
        return resp;
      }).catch(err => {
        console.error(err);
        return false;
      }).finally( () => {

      });
    }

    async updateprofileinfos(usertmp: UserData) {
      const httpparams = new HttpParams()
      .append('request' , 'profileUpdate')
      .append('id' , usertmp.id )
      .append('fname', usertmp.fname)
      .append('lname' , usertmp.lname)
      .append('username' , usertmp.username )
      .append('phone', usertmp.phoneNumber)
      .append('password' , usertmp.password)
      .append('pic' , this.glb.user.pic)
      .append('dob' , usertmp.dob)
      .append('pob' , usertmp.pob)
      .append('address' , usertmp.address)
      .append('pays' , usertmp.country)
      .append('ville', usertmp.ville)
      .append('codeP' , usertmp.codeP)
      .append('propos' , usertmp.propos);
      await this.http.post<Httpresponse>(this.glb.hostServer + 'core.php',  httpparams)
      .toPromise().then( (resp) => {
        console.log(resp.data['pass']);
        this.glb.user = usertmp;
        this.glb.user.password = resp.data['password'];
        this.alertt.presentAlert('Success' , 'Profile info has been updated successfully');
      }).catch( err => {
        console.log(err);
      }).finally( () => {
      });
    }
}