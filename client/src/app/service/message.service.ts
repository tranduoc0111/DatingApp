import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginatedResult, getPaginationHeaders } from './paginationHelper';
import { Message } from '../models/message';
import { environment } from 'src/environments/environment';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../models/user';
import { BehaviorSubject, take } from 'rxjs';
import { group } from '@angular/animations';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubUrl;
  private hubConenction!: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor(private http: HttpClient) {

   }

   createHubConenction(user: User, otherUsername: string){
    this.hubConenction = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
      accessTokenFactory: () => user.token
    })
    .withAutomaticReconnect()
    .build()

    this.hubConenction
    .start()
    .catch(error => console.log(error));


    this.hubConenction.on('ReceiveMessageThread', message => {
      this.messageThreadSource.next(message);
    })

    this.hubConenction.on('NewMessage', message =>{
      this.messageThread$.pipe(take(1)).subscribe(messages =>{
        this.messageThreadSource.next([...messages, message])
      })
    })

    this.hubConenction.on('UpdatedGroup', (group: Group) =>{
      if(group.connections.some(x=> x.username === otherUsername)){
        this.messageThread$.pipe(take(1)).subscribe(messages =>{
          messages.forEach(message =>{
            if(!message.dateRead){
              message.dateRead = new Date(Date.now())
            }
          })
          this.messageThreadSource.next([...messages]);
        })
      }
    })
   }

   stopHubConnection(){
    if(this.hubConenction){
      this.hubConenction.stop();
    }
   }

   getMessages(pageNumber: any, pageSize: any, container: any)
   {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseUrl + 'messages', params, this.http);
   }

   getMessageThread(username: string)
   {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);

   }

   async sendMessgae(username: string, content: string)
   {
    return this.hubConenction.invoke('SendMessage', {recipientUsername: username, content})
    .catch(error => console.log(error));
   }

   deleteMessage(id: number)
   {
    return this.http.delete(this.baseUrl +'messages/' + id);
   }
}
