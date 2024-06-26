import { map } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from 'src/app/modals/roles-modal/roles-modal.component';
import { User } from 'src/app/models/user';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users!: Partial<User[]>;
  bsModalRef!: BsModalRef;

  constructor(private adminService: AdminService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getUserWithRoles();
  }

  getUserWithRoles() {
    this.adminService.getUserWithRoles().subscribe(users => {
      this.users = users;
    })
  }

  openRolesModal(user: User) {
    const config ={
      class:'modal-dialog-centered',
      initialState:{
        user,
        roles: this.getRolesArray(user)
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe((values:any) =>{
      const rolesToUpdate ={
        roles:[...values.filter((el:any) => el.checked === true).map((el:any) => el.name)]
      };
      if(rolesToUpdate){
        this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() =>{
          user.roles=[...rolesToUpdate.roles]
        })
      }
    })
  }

  private getRolesArray(user:any){
    const roles: string[] = [];
    const userRoles = user.roles;
    const availableRoles: any[] =[
      {name: 'Admin', value:'Admin'},
      {name: 'Moderator', value:'Moderator'},
      {name: 'Member', value:'Member'},
      {name: 'Guest', value:'Guest'}
    ];
    availableRoles.forEach(role =>{
      let isMatch = false;
      for(const userRole of userRoles){
        if(role.name === userRole){
          isMatch = true;
          role.checked = true;
          roles.push(role);
          break;
        }
      }
      if(!isMatch){
        role.checked = false;
        roles.push(role);
      }
    })
    return roles;
  }
}
