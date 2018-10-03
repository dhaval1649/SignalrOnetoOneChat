import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, IStreamResult } from '@aspnet/signalr';
import { ChatMessage } from '../Models/chatmessage.model';
import { Promise } from 'q';
import { UserData } from '../UserData';

@Injectable()
export class SignalRService {
  messageReceived = new EventEmitter<ChatMessage>();
  userLogin = new EventEmitter<UserData[]>();
  user = new EventEmitter<UserData>();
  connectionEstablished = new EventEmitter<Boolean>();
  msg = new EventEmitter<ChatMessage>();

  connectionIsEstablished = false;
  private _hubConnection: HubConnection;

  constructor() {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
    this.newUsers();
    this.allusers();
    this.newMsg();
  }

  sendChatMessage(message: ChatMessage, connId: string) {
    this._hubConnection.invoke('SendMessage', message, connId);
  }

  ConnectChat(username: string): any {
    return this._hubConnection.invoke('Login', username);
  }
  public getAllUsers(name: string): any {
    return this._hubConnection.invoke("GetAllUsers", name);
  }
  private createConnection() {
    this._hubConnection = new HubConnectionBuilder()
      .withUrl('/chathub')
      .build();
  }

  private startConnection(): void {
    this._hubConnection
      .start()
      .then(() => {

        this.connectionIsEstablished = true;
        console.log('Hub connection started');
        this.connectionEstablished.emit(true);
      })
      .catch(err => {
        console.log('Error while establishing connection, retrying...');
        setTimeout(this.startConnection(), 5000);
      });
  }
  private registerOnServerEvents(): void {
    this._hubConnection.on('ReceiveMessage', (message: ChatMessage, user: UserData) => {
   console.log('sendmsg', message);
      this.messageReceived.emit(message);
    });
  }
  private allusers(): void {
    this._hubConnection.on('OnlineUsers', (data: UserData[]) => {
      this.userLogin.emit(data);
    });
  }
  private newUsers(): void {
    this._hubConnection.on('NewOnlineUser', (data: UserData) => {
      this.user.emit(data);
    });
  }
  private newMsg(): void {
    this._hubConnection.on('NewMessage', (message: ChatMessage, user: UserData) => {
      console.log('new msg', message.user + '--' + user.userName);
      if (message.user == user.userName) {
        this.msg.emit(message);
      }

    });
  }
}
