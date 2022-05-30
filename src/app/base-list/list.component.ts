import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { APP_CONSTANTS } from '@app/app.constants';
import { AppService } from '@app/app.service';
import { CoreService } from '@app/core/core.service';

@Component({
  template: '',
})
export abstract class BaseListComponent implements OnInit, OnDestroy {
  entity!: {
    singular: string;
    plural: string;
    idKey: string;
  };
  allLables!: {
    pageHeading: string;
    refreshText: string;
    addNewText: string;
    activateText: string;
    searchText: string;
    inActiveateText: string;
    deleteText: string;
  };
  apiUrls!: {
    list: string;
    status: string;
    delete: string;
  };
  capability!: {
    add: string;
    update: string;
    delete: string;
    changeStatus: string;
  };
  pageInfo!: {
    count: 0;
    page: 1;
    pageSize: 10;
  };
  records: any[] = [];
  selected = [];
  selectedItem = [];
  keyword: string = '';
  statusKey: string = 'status';
  statusList: { label: string; value: string }[] = [];
  selectedStatus!: string;
  searchtxtControl = new FormControl();
  subscription!: Subscription;
  filters: { [key: string]: any } = {};
  params: { [key: string]: any } = {};
  constructor(
    protected coreService: CoreService,
    protected apiService: AppService,
    protected cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.searchtxtControl.valueChanges
      .pipe(debounceTime(250))
      .subscribe((value: any) => {
        this.keyword = value;
        this.pageInfo.page = 1;
        this.getList();
      });
    this.getList();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  statusChange() {
    this.pageInfo.page = 1;
    this.getList();
  }

  setPage(pageInfo: any) {
    this.pageInfo.page = pageInfo.offset + 1;
    this.getList();
  }

  onPageChange(page: number): void {
    this.pageInfo.page = 1;
    this.getList();
  }

  getList() {
    const data = {};
    data['page'] = this.pageInfo.page;
    data['limit'] = this.pageInfo.pageSize;
    const filters = [];
    if (this.selectedStatus) {
      // filters.push({ key: this.statusKey, value: this.selectedStatus });
    }

    if (this.filters && Object.values(this.filters).length) {
      Object.keys(this.filters).forEach((key) => {
        if (this.filters[key]) {
          // filters.push({ key, value: this.filters[key] });
        }
      });
    }
    data['filters'] = filters;
    if (this.keyword) {
      data['keyword'] = this.keyword;
    }
    if (this.params && Object.values(this.params).length) {
      Object.keys(this.params).forEach((key) => {
        if (this.params[key]) {
          data[key] = this.params[key];
        }
      });
    }
    // this.apiService.postRequest(this.apiUrls['list'], data).subscribe((res) => {
    //   if (res && res.data && res.settings.success) {
    //     this.selected = [];
    //     this.selectedItem = [];
    //     this.records = res.data;
    //     this.pageInfo.limit = res.settings.per_page;
    //     this.pageInfo.count = res.settings.count;
    //   } else {
    //     this.coreService.displayToast({
    //       message: res.settings.message,
    //       type: 'error',
    //     });
    //   }
    // });
  }

  refreshList() {
    this.getList();
  }

  onSort(event) {
    this.pageInfo.page = 1;
    this.getList();
  }

  onSelect({ selected }, isListView?: boolean) {
    if (this.entity.idKey && selected && selected.length > 0) {
      if (!isListView) {
        this.selectedItem = [];
      }
      selected.forEach((selectedEle) => {
        // this.selectedItem.push(selectedEle[this.entity.idKey]);
      });
    } else {
      this.selectedItem = [];
    }
  }

  changeStatus(status) {
    // if (!this.canChangeStatus) {
    //   this.coreService.displayToast({
    //     message: `You are not having access to change the status of ${this.entity.singular}(s)`,
    //     type: 'error',
    //   });
    //   return;
    // }
    if (this.apiUrls.status && this.selectedItem && this.selectedItem.length) {
      this.coreService
        .showConfirmModal(
          `Are you sure you want to ${status} this ${this.entity.singular}(s)?`,
          'Confirm Status Change'
        )
        .then((result) => {
          if (result === 'Ok') {
            // this.apiService
            //   .postRequest(this.apiUrls.status, {
            //     ids: this.selectedItem,
            //     status,
            //   })
            //   .subscribe((res) => {
            //     if (res && res.settings.success) {
            //       this.coreService.displayToast({
            //         message: res.settings.message,
            //         type: 'success',
            //       });
            //       this.getList();
            //     } else {
            //       this.coreService.displayToast({
            //         message: res.settings.message,
            //         type: 'error',
            //       });
            //     }
            //   });
          }
        });
    } else {
      this.coreService.displayToast({
        message: `Please select atleast one ${this.entity.singular}.`,
        type: 'error',
      });
    }
  }

  delete(id: string) {
    if (this.apiUrls.delete && id) {
      this.coreService
        .showConfirmModal(
          `Are you sure you want to delete this ${this.entity.singular}?`,
          'Confirm Delete'
        )
        .then((result) => {
          if (result === 'Ok') {
          }
        });
    }
  }
}
