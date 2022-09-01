import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../../../core/core.module';
import { select } from '@ngrx/store';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';


@Component({
  selector: 'SelectTemplate',
  templateUrl: './select-template.component.html',
  styleUrls: ['./select-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectTemplateComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private fb: FormBuilder,
  ) 
  {  
    
  }

  ngOnInit(): void {
  }


}
