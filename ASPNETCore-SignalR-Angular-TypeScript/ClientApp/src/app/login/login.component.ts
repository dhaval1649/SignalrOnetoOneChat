import { Component, Inject, NgZone } from '@angular/core';
import { UserData } from '../UserData';
import { UserList } from '../UserData-List';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { SignalRService } from '../services/signalR.service';

@Component({
  templateUrl: './login.component.html',
})

export class LoginComponent {

  userlist: UserData[];
  userModel: UserData = new UserData();
  loginForm: FormGroup;
  public data: any = [];
  users: UserData[] = [];
  currentUser: string;

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private signalrService: SignalRService, private _ngZone: NgZone, private _router: Router) {

    console.log('user',this.storage.get('username'));
    if (this.storage.get('username') != '') {
      console.log('user1', this.storage.get('username'));

      this.signalrService.ConnectChat(this.storage.get('username')).then(

        this._router.navigate(['welcome'])
      );
    }
    //this.signalrService.connectionEstablished.subscribe(() => {
    //  this.signalrService.getAllUsers().then((data) => {
    //    console.log('userlist0', data);
    //    this.users = data;
    //  });
    //});
  }

  onSave() {
    if (this.userModel.userName != '') {
      this.storage.set('username', this.userModel.userName);
      this.data['username'] = this.storage.get('username');
      this.signalrService.ConnectChat(this.userModel.userName).then(data => {

        this._router.navigate(['welcome']);
      });
      //this.signalrService.userLogin.subscribe((user: UserData[]) => {
      //  this.users = user;
      //  this._router.navigate(['welcome']);
      //});
    }
  }
  get name() { return this.loginForm.get('name'); }
}
