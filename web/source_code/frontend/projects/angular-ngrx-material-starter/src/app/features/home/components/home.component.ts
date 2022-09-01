import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/core.module';
import { select } from '@ngrx/store';

import { selectIsHomeLoading } from '../../../core/home/selectors';

@Component({
  selector: 'BiznizHome',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  isHomeLoading$: Observable<boolean>
  constructor(
    private store: Store<AppState>,
  ) {
    this.isHomeLoading$ = this.store.pipe(select(selectIsHomeLoading));
  }

  ngOnInit(): void {

  }

}
