import { Component, Inject } from '@angular/core';
import { UserData } from '../UserData';
import { UserList } from '../UserData-List';
import { SignalRService } from '../services/signalR.service';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { ChatMessage } from '../Models/chatmessage.model';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  users: UserData[];
  currentUser: string;
  newMsgUser: string[] = [];
  cntNewMsg: number = 0;

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService, private _avRoute: ActivatedRoute,private router: Router, private signalrService: SignalRService) {
    this.currentUser = this.storage.get('username');
   
    signalrService.connectionEstablished.subscribe(() => {
      signalrService.getAllUsers(this.currentUser).then((data) => {
        this.users = data;
      });
    });
    this.signalrService.user.subscribe((data: UserData) => {
      this.users.push(data);
    });
    this.signalrService.msg.subscribe((data: ChatMessage) => {
      this.cntNewMsg++;
      console.log(this.cntNewMsg);
      if (this.newMsgUser.findIndex(f => f == data.user) == -1) {
      
        this.newMsgUser.push(data.user);
      }
    });
  }
  collapse(userName: string) {
    console.log(userName);
    var index = this.newMsgUser.findIndex(f => f == userName);
    if (index > -1) {
      this.newMsgUser.splice(index, 1);
      this.cntNewMsg = 0;
    }
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  hasNewMessage(userName: string, connectionId: string) {
  
    return this.newMsgUser.findIndex(f => f == userName) > -1 && this.router.url.indexOf(connectionId) == -1;
  }
}
