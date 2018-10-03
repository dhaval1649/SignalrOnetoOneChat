import { Component, NgZone, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SignalRService } from '../services/signalR.service';
import { ChatMessage } from '../Models/chatmessage.model';
import { Tab } from '../Models/tab.model';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { log } from 'util';
import { UserData } from '../UserData';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})

export class HomeComponent {
  
  chatMessage: ChatMessage;
  canSendMessage: boolean;
  tabs: Tab[];
  currentRoom: string;
  username: string;
 // chatUpdated = new EventEmitter<Boolean>();
  messageHistory: ChatMessage[] = [];
  filteredMessage: ChatMessage[] = [];
  currentUser: string;
  public data: any = [];
  connId: string;

  constructor(
    private signalrService: SignalRService,
    private _ngZone: NgZone,
    private _avRoute: ActivatedRoute,
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,

  ) {
    this.chatMessage = new ChatMessage();
    this._avRoute.params.subscribe(params => {
      this.username = params["id"];
      this.filterMessage();
    });
    this._avRoute.params.subscribe(params => {
      this.connId = params["connid"];

    });

    this.subscribeToEvents();
  
    this.currentUser = this.storage.get('username');
  }
  sendMessage() {
    //console.log(this.canSendMessage);
    if (this.canSendMessage) {
      this.chatMessage.user = this.currentUser;
      this.chatMessage.touser = this.username;
      this.signalrService.sendChatMessage(this.chatMessage, this.username);
      
    }
  }

  private filterMessage() {
    console.log('msg', this.messageHistory);
    console.log('userName', this.username);
    console.log('currentUser', this.currentUser);
    this.filteredMessage = this.messageHistory.filter(x => (x.touser == this.username && x.user == this.currentUser) || (x.touser == this.currentUser && x.user == this.username));
    
  }

  private subscribeToEvents(): void {
    this.signalrService.connectionEstablished.subscribe(() => {
      console.log('Connected');
      this.canSendMessage = true;
    });

    //this.chatUpdated.subscribe(() => {
    //  this.filterMessage();
    //});

    //this.messageHistory = [];
    this.signalrService.messageReceived.subscribe((message: ChatMessage) => {
      this._ngZone.run(() => {

        this.chatMessage = new ChatMessage();
        // if ((this.username == message.touser && this.currentUser == message.user) || (this.username == message.user && this.currentUser == message.touser)) {
        this.messageHistory.push(message);
        //this.chatUpdated.emit(true);
        //}
        this.filterMessage();
      });
    });
  }
}
