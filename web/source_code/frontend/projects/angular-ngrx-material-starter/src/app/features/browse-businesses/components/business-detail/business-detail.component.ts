import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/core.module';

import { Observable, BehaviorSubject } from 'rxjs';
import { select } from '@ngrx/store';

import { selectIsHomeLoading, selectPublicBusinessWithCurrentAddresses } from '../../../../core/home/selectors';

import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'BusinessDetail',
  templateUrl: './business-detail.component.html',
  styleUrls: ['./business-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusinessDetailComponent implements OnInit {
  public business$: Observable<any>;
  public id: string;
  public isHomeLoading$: Observable<boolean>;
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.isHomeLoading$ = this.store.pipe(select(selectIsHomeLoading));
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.business$ = this.store.pipe(select(selectPublicBusinessWithCurrentAddresses(this.id)));
  }

  onBusinessClick(id: string): void {
    
  }
}
