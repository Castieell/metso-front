import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Data, Router } from '@angular/router';
import { STComponent, STColumn, STData, STChange } from '@delon/abc/st';
import { G2MiniBarData } from '@delon/chart/mini-bar';
import { _HttpClient } from '@delon/theme';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs';
import { UserService } from 'src/app/services/users-service';
//import {} from 'UsersMod';



@Component({
  selector: 'app-approves-users-list',
  templateUrl: './approves-users-list.component.html',
  styleUrls: ['./approves-users-list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApprovesUsersListComponent implements OnInit {
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
  // columns: STColumn[] = [
  //   // { title: '', index: 'key', type: 'checkbox' },
  //   { title: 'Id', index: 'pk' },
  //   { title: 'avatar', index: 'avatar' },
  //   { title: 'Email', index: 'email' },
  //   {
  //     title: 'Telefono',
  //     index: 'phone'
  //   },
  //   {
  //     title: 'Nombre',
  //     index: 'first_name'
  //   },
  //   {
  //     title: 'Detalle',
  //     buttons: [
  //       {
  //         text: 'Detalle',
  //         click: item => this.router.navigate(['/users/detail/12'])
  //       }
  //     ]
  //   }
  // ];
  columns: STColumn[] = [
    { title: 'id', index: 'id', width: 100 },
    //{
    //  title: 'Nombre',
    //  index: 'usuarios.name',
    //  width: 100
    //},
    { title: 'Apellido', index: 'usuarios.first_last_name', width: 100 },
    { title: 'RUT', index: 'usuarios.employee_rut', width: 100 },
    { title: 'Certificado', index: 'certificado.nombre_certificado', width: 100 },
    { title: 'Esp. Confinados', index: '', width: 100 },
    { title: 'Induc. CCMC', index: '', width: 100 },
    { title: 'LOTOTO', index: '', width: 100 },
    { title: 'Open Hole', index: '', width: 100 },
    { title: 'NFPA 70E', index: '', width: 100 },
    { title: 'Altura', index: '', width: 100 },
    { title: 'Izaje', index: '', width: 100 },
    { title: 'Certif. Rigger', index: '', width: 100 },
    { title: 'Op.Pte Grua', index: '', width: 100 },
    { title: 'T.en caliente', index: '', width: 100 }, 
    {
      title: 'Actions',
      width: 120,
      buttons: [
        {
          text: 'Detalle',
          click: item => this.router.navigate([`/approve-users/detail/${item.pk}`])
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
    this.getUserToApprove();
  }

  protected getUserToApprove() {
    //console.log('da..100');
    this.userService
      .getUsersCertificates()
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
    console.log(this.q)
    console.log(this.data)
    if (this.q.name && this.q.name.trim() !== '') {
      console.log(this.data);
      const data1 = this.data.filter(
        item =>
          item.usuarios.name.toLowerCase().includes(this.q.name.trim().toLowerCase()) ||
          item.usuarios.employee_rut.toLowerCase().includes(this.q.name.trim().toLowerCase()) ||
          item.usuarios.first_last_name.toLowerCase().includes(this.q.name.trim().toLowerCase())
      );
      console.log(data1)
      this.data = [...data1];
    } else {
    }
  }

  stChange(e: STChange): void {
    switch (e.type) {
      case 'checkbox':
        this.selectedRows = e.checkbox!;
        this.totalCallNo = this.selectedRows.reduce((total, cv) => total + cv['callNo'], 0);
        this.cdr.detectChanges();
        break;
      case 'filter':
        this.getUserToApprove();
        break;
    }
  }
  fullChange(val: boolean): void {
    this.scroll = val ? { y: '550px' } : { y: '430px' };
  }

  // remove(): void {
  //   this.http.delete('/rule', { nos: this.selectedRows.map(i => i['no']).join(',') }).subscribe(() => {
  //     this.getData();
  //     this.st.clearCheck();
  //   });
  // }

  // approval(): void {
  //   this.msg.success(`审批了 ${this.selectedRows.length} 笔`);
  // }

  // add(tpl: TemplateRef<{}>): void {
  //   this.modalSrv.create({
  //     nzTitle: '新建规则',
  //     nzContent: tpl,
  //     nzOnOk: () => {
  //       this.loading = true;
  //       this.http.post('/rule', { description: this.description }).subscribe(() => this.getData());
  //     }
  //   });
  // }

  reset(): void {
    // wait form reset updated finished
    setTimeout(() => this.getUserToApprove());
  }

  createUser() {
    this.router.navigate([`/users/create`]);
  }

}
