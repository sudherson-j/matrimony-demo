import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  constructor() {}

  title = new BehaviorSubject('Matrimony');

  setTitle(title: string) {
    this.title.next(title);
  }
}
