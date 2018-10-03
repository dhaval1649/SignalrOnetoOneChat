
/** represent chat message class */
export class ChatMessage {

  user: string;
  touser: string;
  message: string;

  constructor(user: string = '', touser: string = '', message: string='') {
    this.user = user;
    this.touser = touser;
    this.message = message;
  }
}
