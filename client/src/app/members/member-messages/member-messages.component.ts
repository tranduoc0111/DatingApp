import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Message } from 'src/app/models/message';
import { MessageService } from 'src/app/service/message.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit{
  @ViewChild('messageForm') messageForm!: NgForm;
  @Input() username!: string;
  @Input() messages!: Message[];
  messageContent!: string;

  constructor(public messageService: MessageService) {}

  ngOnInit(): void {

  }
  sendMessages(){
    this.messageService.sendMessgae(this.username, this.messageContent).then(
      () =>{
        this.messageForm.reset();
      }
    )
  }

}
