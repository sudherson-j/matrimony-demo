import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, map, mergeMap, takeUntil } from 'rxjs';
import { TitleService } from './shared/services/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'Matrimony';

  private destroy = new Subject();

  constructor(
    private router: Router,
    private browserTitleService: Title,
    private titleService: TitleService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnDestroy() {
    this.destroy.next(0);
    this.destroy.complete();
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route: any) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .pipe(takeUntil(this.destroy))
      .subscribe((event: any) => {
        this.titleService.setTitle(event['title']);
        this.browserTitleService.setTitle(event['title']);
      });
  }
}
