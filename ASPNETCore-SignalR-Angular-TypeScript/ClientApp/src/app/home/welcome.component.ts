import { Component, Inject, } from '@angular/core';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { SignalRService } from '../services/signalR.service';
import { UserData } from '../UserData';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
})
export class WelcomeComponent {
  currentUser: string;
  public data: any = [];
  users: UserData[] = [];
  userModel: UserData = new UserData();
  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private signalrService: SignalRService, private route: ActivatedRoute) {
    this.data['username'] = this.storage.get('username');
    this.currentUser = this.storage.get('username');
    //this.signalrService.ConnectChat(this.storage.get('username')).then(data => {
    //  //this.userlist.push(new UserData(4,~ data["connectionId"], this.userModel.username, true))
    //});
    //this.signalrService.userLogin.subscribe((user: UserData[]) => {
    //  console.log('nav-user', user);
    //  this.users = user;
    //});
    this.signalrService.connectionEstablished.subscribe(() => {
      this.signalrService.getAllUsers(this.currentUser).then((data) => {
        console.log('userlist0', data);
        this.users = data;
      });
    });
   
  }
}
