import { Store, select } from '@ngrx/store';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import {
  routeAnimations,
  selectAuthIsAuthenticated
} from '../../../core/core.module';

import { State } from '../examples.state';

@Component({
  selector: 'bizniz-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss'],
  animations: [routeAnimations],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamplesComponent implements OnInit {
  isAuthenticated$: Observable<boolean> | undefined;

  examples = [
    { link: 'todos', label: 'bizniz.examples.menu.todos' },
    { link: 'stock-market', label: 'bizniz.examples.menu.stocks' },
    { link: 'theming', label: 'bizniz.examples.menu.theming' },
    { link: 'crud', label: 'bizniz.examples.menu.crud' },
    {
      link: 'simple-state-management',
      label: 'bizniz.examples.menu.simple-state-management'
    },
    { link: 'form', label: 'bizniz.examples.menu.form' },
    { link: 'notifications', label: 'bizniz.examples.menu.notifications' },
    { link: 'elements', label: 'bizniz.examples.menu.elements' },
    { link: 'authenticated', label: 'bizniz.examples.menu.auth', auth: true }
  ];

  constructor(private store: Store<State>) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.store.pipe(select(selectAuthIsAuthenticated));
  }
}
