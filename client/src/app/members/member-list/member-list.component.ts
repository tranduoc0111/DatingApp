import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Member } from 'src/app/models/member';
import { Pagination } from 'src/app/models/pagination';
import { User } from 'src/app/models/user';
import { UserParams } from 'src/app/models/userparams';
import { AccountService } from 'src/app/service/account.service';
import { MembersService } from 'src/app/service/members.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  members!: Member[];
  pagination!: Pagination;
  userParams!: UserParams;
  user!: User;
  vnp_ResponseCode: string = "";

  genderList = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];
  constructor(private memberService: MembersService, private route: ActivatedRoute) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
    this.route.queryParamMap.subscribe(params => {
      this.vnp_ResponseCode = params.get('vnp_ResponseCode') || ''; // Lấy giá trị của vnp_ResponseCode từ URL
      console.log('vnp_ResponseCode:', this.vnp_ResponseCode);
    });
  }

  ngAfterViewInit() {
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(res => {
      this.members = res.result;
      this.pagination = res.pagination;
    })
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  }
  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadMembers();
  }
}
