import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../core/core.module';
import { select } from '@ngrx/store';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { selectCreatePostingApplicationId } from '../../../../../../core/forms/selectors';
import { selectCreatePostingForm } from '../../../../../../core/forms/selectors';

import { CreatePostingForm } from '../../../../../../core/forms/state';

@Component({
  selector: 'CreatePosting',
  templateUrl: './create-posting.component.html',
  styleUrls: ['./create-posting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreatePostingComponent implements OnInit {
  public createPostingForm$: Observable<CreatePostingForm>;
  public createPostingForm: CreatePostingForm;

  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) 
  {  
    this.createPostingForm$ = this.store.pipe(select(selectCreatePostingForm));
    this.createPostingForm$.subscribe(res => this.createPostingForm = res);
  }

  ngOnInit(): void {
  }


}
