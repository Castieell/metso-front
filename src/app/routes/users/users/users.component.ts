import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { STChange, STComponent, STData, STColumn } from '@delon/abc/st';
import { G2MiniBarData } from '@delon/chart/mini-bar';
import { _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { map, tap } from 'rxjs';

import { UserService } from '../../../services/users-service';

export interface Data {
  id: number;
  email: string;
  phone: number;
  address: string;
  disabled: boolean;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent implements OnInit {
  listOfData: readonly Data[] = [];
  ps = 20;
  total = 200; // mock total
  args = { _allow_anonymous: true, userid: null };
  url = `https://api.randomuser.me/?results=20`;
  events: G2MiniBarData[] = [];
  scroll = { y: '230px' };
  token: string;
  q: {
    pk: number;
    name: string;
    first_last_name: string;
    employee_rut: string;
    ps: number;
    email: string;
    sorter: string;
    status: number | null;
    statusList: NzSafeAny[];
  } = {
      pk: 1,
      ps: 10,
      email: '',
      sorter: '',
      status: null,
      statusList: [],
      name: '',
      first_last_name: '',
      employee_rut: ''
    };
  data: any[] = [];
  dataOriginal: any[] = [];
  loading = false;
  status = [
    { index: 0, text: '', value: false, type: 'default', checked: false },
    {
      index: 1,
      text: '',
      value: false,
      type: 'processing',
      checked: false
    },
    { index: 2, text: '', value: false, type: 'success', checked: false },
    { index: 3, text: '', value: false, type: 'error', checked: false }
  ];
  @ViewChild('st', { static: true })
  st!: STComponent;
  columns: STColumn[] = [
    { title: 'id', index: 'id', width: 100 },
    {
      title: 'Nombre',
      index: 'name',
      width: 100
    },
    { title: 'Apellido', index: 'first_last_name', width: 100 },
    { title: 'RUT', index: 'employee_rut', width: 100 },
    { title: 'Cargo', index: 'cargo', width: 100 },
    { title: 'Contrato', index: 'contrato', width: 100 },
    {
      title: 'Actions',
      width: 120,
      buttons: [
        {
          text: 'Detalles',
          click: item => this.router.navigate([`/users/detail/${item.pk}`])
        }
      ]
    }
  ];
  selectedRows: STData[] = [];
  description = '';
  totalCallNo = 0;
  expandForm = false;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private modalSrv: NzModalService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
    private router: Router
  ) {
    this.token = JSON.parse(localStorage.getItem('userData') || '{}').token;
  }

  ngOnInit(): void {
    this.loading = true;
    this.getUserData();
  }

  protected getUserData() {
    this.userService
      .getUsers()
      .pipe(tap(() => (this.loading = false)))
      .subscribe(res => {
        this.data = res;
        this.dataOriginal = res;
        this.loading = false;
        this.cdr.detectChanges();
      });
  }

  protected getUserFilter() {
    this.data = this.dataOriginal;
    if (this.q.name && this.q.name.trim() !== '') {
      console.log(this.data);
      const data1 = this.data.filter(
        item =>
          item.name.toLowerCase().includes(this.q.name.trim().toLowerCase()) ||
          item.employee_rut.toLowerCase().includes(this.q.name.trim().toLowerCase()) ||
          item.first_last_name.toLowerCase().includes(this.q.name.trim().toLowerCase())
        //item.Cargo.toLowerCase().includes(this.q.name.trim().toLowerCase()) ||
        //item.Contrato.toLowerCase().includes(this.q.name.trim().toLowerCase())
      );
      console.log(data1)
      this.data = [...data1];
    } else {
    }
  }

  createUser() {
    this.router.navigate([`/users/create`]);
  }

  stChange(e: STChange): void {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv['callNo'], 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getUserData();
        break;
    }
  }
  fullChange(val: boolean): void {
    this.scroll = val ? { y: '550px' } : { y: '430px' };
  }

  reset(): void {
    setTimeout(() => this.getUserData());
  }
}
