import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-roles-modal',
  templateUrl: './roles-modal.component.html',
  styleUrls: ['./roles-modal.component.css']
})
export class RolesModalComponent implements OnInit {
@Input() updateSelectedRoles = new EventEmitter();
user!: User;
roles!: any[];

  constructor(public bsModalRef: BsModalRef){}

  ngOnInit(): void {

  }

  updateRoles() {
    this.updateSelectedRoles.emit(this.roles);
    this.bsModalRef.hide();
  }

}
