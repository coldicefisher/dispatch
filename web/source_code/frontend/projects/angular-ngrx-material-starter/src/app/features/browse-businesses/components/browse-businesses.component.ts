import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../core/core.module';

import { Observable, BehaviorSubject } from 'rxjs';
import { select } from '@ngrx/store';

import { selectPublicBusinessesWithCurrentAddresses } from '../../../core/home/selectors';

import { Router } from '@angular/router';

@Component({
  selector: 'BrowseBusinesses',
  templateUrl: './browse-businesses.component.html',
  styleUrls: ['./browse-businesses.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseBusinessesComponent implements OnInit {
  public businesses$: Observable<any>;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    
    this.businesses$ = this.store.pipe(select(selectPublicBusinessesWithCurrentAddresses));
    
  }

  ngOnInit(): void {
    
  }

  onBusinessClick(id: string): void {
    this.router.navigateByUrl(`/business/${id}`);
  }
}
