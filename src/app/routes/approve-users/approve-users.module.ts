import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AvatarListModule } from '@delon/abc/avatar-list';
import { EllipsisModule } from '@delon/abc/ellipsis';
import { FooterToolbarModule } from '@delon/abc/footer-toolbar';
import { FullContentModule } from '@delon/abc/full-content';
import { TagSelectModule } from '@delon/abc/tag-select';
import { G2MiniBarModule } from '@delon/chart/mini-bar';
import { CurrencyPipeModule } from '@delon/util';
import { SharedModule } from '@shared';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzTableModule } from 'ng-zorro-antd/table';

import { ApproveUserRoutingModule } from './approve-users-routing.module';
import { ApprovesUserDetailComponent } from './approves-user-detail/approves-user-detail.component';
import { ApprovesUsersListComponent } from './approves-users-list/approves-users-list.component';
import { ModalDetailUserComponent } from './modal-detail-user/modal-detail-user.component';
import { UsersModule } from '../users/users.module';

@NgModule({
  declarations: [ApprovesUserDetailComponent, ApprovesUsersListComponent, ModalDetailUserComponent],
  imports: [
    CommonModule,
    EllipsisModule,
    TagSelectModule,
    AvatarListModule,
    FooterToolbarModule,
    NzPaginationModule,
    NzStepsModule,
    CurrencyPipeModule,
    G2MiniBarModule,
    FullContentModule,
    SharedModule,
    ApproveUserRoutingModule,
    UsersModule,
    NzTableModule
  ]
})
export class ApproveUsersModule {}
