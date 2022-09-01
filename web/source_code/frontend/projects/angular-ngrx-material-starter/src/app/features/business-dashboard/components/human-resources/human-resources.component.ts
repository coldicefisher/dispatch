import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../core/core.module';

import { FormBuilder, FormGroup } from '@angular/forms';
import { actionNavigateDashboard } from '../../../../core/business/actions';


@Component({
  selector: 'bizniz-human-resources',
  templateUrl: './human-resources.component.html',
  styleUrls: ['./human-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HumanResourcesComponent implements OnInit {
  showCreateApplication: boolean = true;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) 
  {  
  }

  ngOnInit(): void {
  }

  hrToolbar = this.fb.group({

  })


  onCreateApplicationClick(): void {
    //this.showCreateApplication = !this.showCreateApplication;
    this.store.dispatch(actionNavigateDashboard({route: 'create-application'}))
  }

  onCreatePostingClick(): void {
    //this.showCreateApplication = !this.showCreateApplication;
    this.store.dispatch(actionNavigateDashboard({route: 'create-posting'}))
  }
}
