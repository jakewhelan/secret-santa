import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ss-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor (
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}
  
  ngOnInit() {
    
    /*
     *  @angular/router does not support page titles
     *  out of the box. Using rxjs filter, map &
     *  mergeMap we'll filter the router Observable
     *  to find custom config of the last ActivatedRoute
     *  and set it as the page title.
     *
     *  Additionally, Angular doesn't return to top of
     *  page post-routing so we do this also.
     */
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) {
        route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === 'primary')
      .mergeMap(route => route.data)
      .subscribe((event) => {
        this.titleService.setTitle(event['title']);
        window.scrollTo(0, 0);
      });
      
  }

}
