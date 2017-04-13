import { Observable } from 'rxjs/Observable';

import { Component, OnInit } from '@angular/core';

// services
import { ListService } from './list.service';
import { LoaderService } from '../shared/components/loader/loader.service';

@Component({
  selector: 'ss-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(
    private listService: ListService
  ) {}

  getUsers(): Observable<any> {
    return this.listService.getUsers();
  } 

  ngOnInit() {
    this.getUsers();
  }

}
