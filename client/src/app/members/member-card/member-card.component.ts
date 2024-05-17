import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/models/member';
import { AccountService } from 'src/app/service/account.service';
import { MembersService } from 'src/app/service/members.service';
import { PresenceService } from 'src/app/service/presence.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() member!: Member;
  checkRole: boolean = false;

  constructor(
    private memberService: MembersService,
    private accountService: AccountService,
    private toastr: ToastrService,
    public presence: PresenceService,
    private router: Router
  ) {

  }


  ngOnInit(): void {
    this.accountService.getCurrentUser().subscribe(res => {
      if (res) {
        this.checkRole = res.roles.find(e => e == "Member") ? true : false;
      } else {
        console.log('Không có người dùng hiện tại');
      }
    });
  }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe(() => {
      this.toastr.success('You have liked' + member.knowAs);
    })
  }
}
