import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { AppState } from '../../../../core/core.module';

import { actionSetAsDefaultBusiness } from '../../../../core/business/actions';
import { selectBusiness } from '../../../../core/business/selectors';
@Component({
  selector: 'bizniz-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardHomeComponent implements OnInit {
  business$: Observable<any>;
  business: any;
  constructor(
    private store: Store<AppState>,
  ) 
  {
    this.business$ = this.store.pipe(select(selectBusiness));
    this.business$.subscribe(res => this.business = res);
  }

  ngOnInit(): void {
  }

  onSetAsDefaultClick(): void {
    this.store.dispatch(actionSetAsDefaultBusiness({ businessName: this.business.name }));
  }
}
